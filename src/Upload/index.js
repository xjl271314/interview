import React, { useState, useRef, useMemo } from 'react';
// import webWorkerScript from './worker';
import SparkMD5 from 'spark-md5';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Upload, Space, Button } from 'antd';
// const worker = useRef();
const fileHash = useRef();
const [data, setData] = useState([]);
const [file, setFile] = useState(null);
const [chunkList, setChunkList] = useState([]);
const [uploadedChunk, setUploadedChunk] = useState([]);
const [hashProgress, setHashProgress] = useState(0);

// 定义超过3M的文件即为大文件
const MAX_FILE_SIZE = 3 * 1024 * 1024;

// 定义每个切片为0.05M~52k
const CHUNK_SIZE = 0.05 * 1024 * 1024;

// 上传
const uploadRequest = async (params) => {
  return axios.post('请求的后端上传接口地址', params);
};

// 总的上传进度
const percent = useMemo(() => {
  if (!file || !chunkList.length) return 0;
  const loaded = chunkList
    .map((item) => item.progress * item.chunk.size)
    .reduce((sum, next) => sum + next);
  return parseInt((loaded / file.size).toFixed(2));
}, [file, chunkList]);

// 生成文件哈希值，用来标识文件的唯一性，实现断点续传
// 但对于文件，生成文件摘要MD5用来标识唯一性是最合适的，
// 因为MD5是对文件内容进行抽样生成的唯一值，文件内容改变，MD5值就会变，反之则不变
// 前端可以使用 spark-md5 用来计算文件的MD5。
// 由于计算MD5会一直占用线程，防止页面阻塞我们可以利用WebWorker新开线程执行该操作：
const createFileHash = (fileSlicesList) => {
  return new Promise((resolve, reject) => {
    try {
      //   worker.current = new Worker(webWorkerScript);
      //   worker.current.postMessage({
      //     spark: new SparkMD5.ArrayBuffer(),
      //     fileSlicesList,
      //   });
      //   worker.current.onmessage = (e) => {
      //     const { hash, progress } = e.data;
      //     setHashProgress(progress);
      //     if (hash) {
      //       resolve(hash);
      //     }
      //   };
      const spark = new SparkMD5.ArrayBuffer();
      // 总共的切片长度
      const chunks = fileSlicesList.length;
      // 当前切片位置
      let currentChunk = 0;
      // 上传切片进度
      let progress = 0;
      const loadNext = (index) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(fileSlicesList[index]);
        fileReader.onload = (e) => {
          currentChunk++;
          const chunk = e.target.result;
          spark.append(chunk);

          if (currentChunk === chunks) {
            const hash = spark.end();
            setHashProgress(progress);
            if (hash) {
              fileHash.current = hash;
              resolve(hash);
            }
          } else {
            progress += 100 / chunks;
            setHashProgress(progress);
            loadNext(currentChunk);
          }
        };
      };
      loadNext(0);
    } catch (e) {
      reject(e);
    }
  });
};

// 生成文件切片 OK
const createFileSlices = (file, size = CHUNK_SIZE) => {
  const fileSlices = [];
  let cur = 0;
  console.log('file.size', file.size, 'fileSize', size);
  while (cur < file.size) {
    fileSlices.push(file.slice(cur, cur + size));
    cur += size;
  }

  return fileSlices;
};

// 组装分片包
const createFileChunks = (file, fileSlicesList) => {
  if (!fileSlicesList || !fileSlicesList.length) return [];

  return fileSlicesList.map((slice, index) => ({
    index,
    chunk: slice,
    hash: fileHash.current + '-' + index,
    fileName: file.name,
    progress: 0,
    cancel: () => {},
  }));
};

// 获取cancelToken
const createCancelAction = (chunk) => {
  const { cancel, token } = axios.CancelToken.source();
  chunk.cancel = cancel;
  return token;
};

// 创建每个chunk上传的progress监听函数
const createProgressHandler = (index) => {
  return (e) => {
    setChunkList((prev) => {
      const newList = prev.concat([]);
      const chunk = newList.find((item) => item.index === index);
      if (chunk) {
        chunk.progress = parseInt(String((e.loaded / e.total) * 100));
      }

      return newList;
    });
  };
};

// 上传文件切片
const uploadFileChunks = async (chunks, upLoadedChunks) => {
  if (!chunks || !chunks.length) return;
  const requests = chunks
    .filter(({ hash }) => !upLoadedChunks.includes(hash))
    .map((item) => {
      const { chunk, hash, fileName, index } = item;
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('hash', hash);
      formData.append('filename', fileName);

      const cancelToken = createCancelAction(item);
      const onUploadProgress = createProgressHandler(index);

      return uploadRequest(data, {
        onUploadProgress,
        cancelToken,
      });
    });

  return Promise.all(requests);
};

// 点击上传文件
const handleUpload = () => {
  console.log('开始文件上传');
};

// 检查是否上传
const checkUpload = async (params) => {
  return axios.post('请求的后端接口地址', params);
};

// 请求后端合并接口
const mergeRequest = async (params) => {
  return axios.post('请求的后端接口地址', params);
};

// 暂停上传
const handlePauseUpload = () => {
  // axios的cancel在调用abort前会判断请求是否存在，所以针对所有的请求直接调用cancel即可
  chunkList.forEach((chunk) => chunk.cancel());
};

// 恢复上传
const handleResumeUpload = async () => {
  await uploadFileChunks(chunkList, uploadedChunk);
  mergeRequest({
    fileName: file?.name || '',
    hash: hash.current,
    size: CHUNK_SIZE,
  });
};

// 上传方法
const handleFileChange = async (info) => {
  if (!info.file || info.file.status !== 'done') return;
  // upload内的原始文件是originFileObj
  const file = info.file.originFileObj;
  const fileSlicesList = createFileSlices(file);
  console.log('fileSlicesList', fileSlicesList);
  console.time('fileHash');
  const hashName = await createFileHash(fileSlicesList);
  console.log('hashName', hashName);
  console.timeEnd('fileHash');
  //   const res = await checkUpload({ fileName: file.name, hash: hashName });
  //   // 文件已经上传
  //   if (res.data.fileExist) {
  //     message.info('文件已上传');
  //     return;
  //   }
  // 组装待上传的分片包
  const chunks = createFileChunks(file, fileSlicesList);
  console.log('chunks', chunks);
  // 已经上传的分片
  // const uploadedChunkNameList = res.data.uploadedChunks;
  const uploadedChunkNameList = [];
  setChunkList(chunks);
  setUploadedChunk(uploadedChunkNameList);
  await uploadFileChunks(chunks, uploadedChunkNameList);
};

// 原生input
// const handleInputFileChange = async (e) => {
//   const [file] = e.target.files;
//   if (!file) return;

//   setFile(file);
//   const fileSlicesList = createFileSlices(file);
//   console.log('fileSlicesList', fileSlicesList);
// };

export default () => (
  <Space>
    <Upload onChange={handleFileChange}>
      <Button onClick={handleUpload}>点击上传文件</Button>
    </Upload>
    {/* <input type="file" onChange={handleInputFileChange} /> */}
  </Space>
);
