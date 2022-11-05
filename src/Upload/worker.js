// web worker
// 未安装的话 执行 npm install --save spark-md5
// 通常情况下，worker是需要加载一个单独的js文件，但是也可以通过一些方法加载页面中的一些方法函数，
// 原理就是把函数方法转换成一个blob类型之后，再转换成一个url类型
importScripts('./spark.js');
const spark = new SparkMD5.ArrayBuffer();

const webWorkerCode = () => {
  self.onmessage = (e) => {
    const { fileChunkList } = e.data;
    // 总共的切片长度
    const chunks = fileChunkList.length;
    // 当前切片位置
    let currentChunk = 0;
    // 上传切片进度
    let progress = 0;
    const loadNext = (index) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileChunkList[index]);
      fileReader.onload = (e) => {
        currentChunk++;
        const chunk = e.target.result;
        console.log('chunk', chunk);
        spark.append(chunk);

        if (currentChunk === chunks) {
          self.postMessage({
            progress: 100,
            hash: spark.end(),
          });
          // 关闭worker
          self.close();
        } else {
          progress += 100 / chunks;
          console.log('else', self.postMessage);
          self.postMessage({ progress: parseInt(progress) });
          loadNext(currentChunk);
        }
      };
    };
    loadNext(0);
  };
};

let code = webWorkerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const webWorkerScript = URL.createObjectURL(blob);

export default webWorkerScript;
