import SNKComment from '../core';
import './index.less';

class PCDemo {
  constructor(params) {
    console.log(params);
  }

  method = () => {
    document.write('success');
  }
}

window.onload = () => {
  const root = document.getElementById('xz-lightapp-root');
  const switchBtn = document.createElement('BUTTON');
  switchBtn.innerHTML = '可用';
  switchBtn.addEventListener('click', () => {
    if (switchBtn.innerHTML === '可用') {
      cInstance.setDisabled(true);
      switchBtn.innerHTML = '不可用';
    } else {
      cInstance.setDisabled(false);
      switchBtn.innerHTML = '可用';
    }
  });
  root.appendChild(switchBtn);


  const setTypeBtn = document.createElement('BUTTON');
  setTypeBtn.innerHTML = '日期';
  setTypeBtn.addEventListener('click', () => {
    if (setTypeBtn.innerHTML === '日期') {
      cInstance.setType('text');
      setTypeBtn.innerHTML = '文本';
    } else {
      cInstance.setType('date');
      setTypeBtn.innerHTML = '日期';
    }
  });
  root.appendChild(setTypeBtn);


  const ConsoleBtn = document.createElement('BUTTON');
  ConsoleBtn.innerHTML = 'console data';
  ConsoleBtn.addEventListener('click', () => {
    console.log(cInstance.getData());
  });
  root.appendChild(ConsoleBtn);

  const wrapper = document.createElement('DIV');
  wrapper.className = 'test-wrapper';
  const cInstance = new SNKComment({
    wrapper,
    // colorSelect: false,
    defaultType: 'date',
    // disabled: true, // 禁用
    onImageCreate: (params) => {
      const imagSrc = params.data.src;
      const img = new window.Image();
      img.src = imagSrc;
      img.onload = () => {
        console.log(img.width, img.height);
      };
    },
    onImagedel: (params) => {
      console.log(params);
    },
  });
  const data = [
    {
      src: 'data:image/png;base64,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',
      value: '2018-12-04',
      fontSize: '27',
      fontColor: 'green',
      top: 397,
      left: 211,
      width: 148,
      height: 34,
      // isNotMy:true,
    },
    {
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAbCAYAAACKlipAAAAC5UlEQVRoQ+3YT6hVVRTH8c/un1EWIRgYBYWWlVkoJZWDGihlENhQTQgMQTREq5mIiqVCCFHQPxQk6A9EERUiGITgJKRBvf4XUTQsyEFZgZ5Y96z7OFj2rkGP8zjnDC6XfTd7LX7fvdZv3VP0T6sUKK3Kpk9GD6Rll6AH0mUgFRfiFRwqvDBZWkyluJNaIRUX4UscKGyZRCBTJm4P5H+8Ff/lAvZA2g6k4lLMx0l8Uvj1n3IeZV9lMMXFWTfjQ/x4ppY1ynmRxyj7pkLcM92D8QqpOB+78Yj6ezwn8GjhueEBFefiCTyOc3L9d2zHnjLQbPBxWRr4stxzCnuxCvuHHtK1uBMVZBPIw3gJ2/BMQtmJlbip8F0KvRxvYaN6UoozHsNWLCyM5Q3dhxVYl2CuwZu4MYA2gHQq7tkAWYJZeL3wZ4p/W7aapYXDubY2QdxQ+CLXYopZhLHCTxUz8TXeK3VFDJ6KxTiCXQ0gnYo7MpAUbDruxS2Yh3vUo2oTyOyE9AveSE84XPihIfwCfIQ1hf2N9UvwFfY1x96KTsX9NyjNlvVA9HYcxwf4Bp9mmxkHkuCuDrERwt+BGblvdeG3ijtxNFpW4bUGkL/9H6joVNyRKiRvaIj/MZaXesKKFnNt3uhmhUwL3yiEkceegPpgwlxfeLHiOnweRl/Y0QByZZ63Nyqka3EnghG/Dyqk4gp8i5cL4RHD8fJV3HdayzqAW9PA/8i9V2XrerKws+KCbGsX4/bCzwnuKWwemnrX4p4NkPNwEHdl64kKCRDfp5+sLAScABVGHwYfU9f79ZL7cTkWFz7LfXfj3WyB72Au5qjH4aezQjoVd2QgKWAY7gZ1/w8fCdHfxqaonkJUxnBailb2EK5XV0O8n3q+1L4z/lT1iBtjbwwCY3gWq3GscKiLcSeCMqmvTiZKpv89PaQXoj0K9BXSHhaDTHogPZCWKdCydPoK6YG0TIGWpdNXSA+kZQq0LJ2/ABnmBDrD37OUAAAAAElFTkSuQmCC',
      value: '123456',
      fontSize: '20',
      fontColor: 'red',
      top: 10,
      left: 10,
    },
  ];
  cInstance.setData(data);
  root.appendChild(wrapper);
};

export default PCDemo;
