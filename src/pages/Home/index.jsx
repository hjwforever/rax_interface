/* eslint-disable no-console */
/* eslint-disable @iceworks/best-practices/no-http-url */
import { createElement, useState, useRef } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TextInput from 'rax-textinput';
import styles from './index.module.css';
import Image from 'rax-image';
import Logo from '@/components/Logo';
import Link from 'rax-link';
// import Picture from 'rax-picture';
// import { Button, Icon } from '@alifd/next';
// import { Button, Radio } from 'antd';
import Video from 'rax-video';
import File from 'universal-file';
import chooseImage from 'universal-choose-image';
import request from 'universal-request';
// import { saveAs } from 'file-saver';

const options = {
  count: 1,
  sourceType: ['camera', 'album'],
  accept: 'video/mp4',
};


const upLoadFile = (url) => {
  // blobUri = 'blob:https://imgss.github.io/db7ea2b6-12a5-4e6e-8983-3e69c3fd64f7';
  console.log(url);
  chooseImage(options).then((fp) => {
    console.log('local file obj', fp);
    // request({
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     boundary: '----WebKitFormBoundaryKPjN0GYtWEjAni5F',
    //   },
    //   url: 'http://101.201.127.11:7001/api/upload',
    //   method: 'POST',
    //   data: {
    //     from: 'Rax',
    //     file: fp,
    //   },
    //   dataType: 'json',
    // }).then((response) => { console.log(response); })
    //   .catch((error) => {});

    let fileName; let
      filePath;
    if ('files' in fp) {
      fileName = fp.files[0].name;
      filePath = fp.data;
    } else if ('tempFilePaths' in fp) {
      fileName = fp.tempFilePaths[0];
      filePath = fp.tempFilePaths[0];
    } else {
      console.log('无图片');
    }

    File.upload({
      url,
      fileType: 'video',
      fileName,
      filePath,
      success: (res) => {
        console.log('upload success', res);
      },
      fail: (err) => {
        console.log('upload fail', err);
      },
    });
  });
};

export default function Home() {
  const imageRef = useRef(null);
  const [blobUri, setBlobUri] = useState('http://rax.aruoxi.com/api/upload');
  const [text, setText] = useState('【 Upload 】');
  const [flag, setFlag] = useState(0);

  // const objectURL = URL.createObjectURL('blob:https://imgss.github.io/db7ea2b6-12a5-4e6e-8983-3e69c3fd64f7');

  const changeUri = () => {
    if (text !== '【 Upload 】') {
      setBlobUri('http://rax.aruoxi.com/api/upload');
      setText('【 Upload 】');
    } else {
      setBlobUri('http://rax.aruoxi.com/api/doBlob');
      setText('【 doBlob 】');
    }
    console.log('text changed\nBlobUri changed');
  };

  const getProcessFlag = () => {
    request({
      url: 'http://rax.aruoxi.com/api/flag',
      method: 'GET',
      dataType: 'json',
    }).then((response) => {
      const processFlag = response.data.data;
      console.log('get flag', processFlag);
      setProcessFlag(processFlag);
    })
      .catch((error) => { console.log('get flag ERROR', error); });
  };

  const setProcessFlag = (value) => {
    request({
      url: 'http://rax.aruoxi.com/api/flag',
      method: 'POST',
      data: {
        flag: value,
      },
      dataType: 'json',
    }).then((response) => { console.log('set flag', response); setFlag(response.data.data); })
      .catch((error) => { console.log('set flag ERROR', error); });
  };

  return (
    <View className={styles.homeContainer}>


      {/* <Text type="primary" size="large" onClick={upLoadFile({ blobUri })}>{ text }</Text> */}
      <Link
        href={'#'}
        miniappHref={'/pages/Home/index'}
        onClick={(e) => {
          console.log(e);
          console.log('blobUri', blobUri);
          upLoadFile(blobUri);
        }}
      >
        <Text >
          { text }
        </Text>
      </Link>
      <Text type="primary" size="large" onClick={changeUri}>【Change 】</Text>
      <Text >
        processFlag: { flag }
      </Text>
      <TextInput
        value={flag}
        placeholder={`set flag = ${flag}`}
        onBlur={(e) => setProcessFlag(e.target.value)}
      />
      <Text onClick={getProcessFlag}>
        【 get flag 】
      </Text>


      {/* <Text type="primary" size="large" onCLick={upLoadFile('http://rax.aruoxi.com/api/upload')}>【 UpLoad 】</Text> */}
      {/* 'http://127.0.0.1:7001/api/upload'  'https://rax.aruoxi.com/api/upload' */}
      {/* <form method="POST" action="http://rax.aruoxi.com/api/upload" encType="multipart/form-data">
        file: <input name="file" type="file" />
        title: <input name="title" type="text" value="233" />
        <button type="submit">Upload</button>
      </form> */}


    </View>

  );
}
