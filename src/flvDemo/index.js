import React from 'react';
import { Input, Button, Space } from 'antd';
import Reflv from './flv';

export default class TestPlayer extends React.Component {
  state = {
    playUrl: 'https://liveplay2.weipaitang.com/live/1904012355qZjEka.flv',
  };

  changeUrl = (e) => {
    this.setState({
      playUrl: e.target.value,
    });
  };
  render() {
    const { playUrl } = this.state;

    return (
      <div>
        <h1>FLV.js直播测试</h1>
        <Reflv type="flv" url={playUrl} isLive={true} style={{ width: 300 }} />
        <Space>
          <Input
            style={{ width: 450 }}
            value={playUrl}
            placeholder="请输入拉流地址flv格式"
            onChange={this.changeUrl}
          />
          <Button type="primary">确认</Button>
        </Space>
      </div>
    );
  }
}
