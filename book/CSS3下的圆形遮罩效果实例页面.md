#### CSS代码：
```
.trans {
    /*transition*/
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
    -ms-transition: 0.3s ease;
    -o-transition: 0.3s ease;
    transition: 0.3s ease;
}
.test_outer {
    display: block;
    width: 512px;
    height: 381px;
    margin: 1em auto;
    position: relative;
    overflow: hidden;
}
.test_cover {
    width: 100px;
    height: 100px;
    border: 512px solid rgba(0, 0, 0, .35);
    border-radius: 50%;
    position: absolute;
    left: -325px;
    top: -465px;
}
.test_cover:hover {
    width: 150px;
    height: 150px;
    left: -350px;
    top: -490px;
}
.test_cover:hover:after {
    content: "看，菊花！";
    margin: 50px 0 0 -30px;
    color: #fff;
    font: bold 20px/1.2 '微软雅黑';
    text-shadow: 1px 1px rgba(0, 0, 0, .35);
    position: absolute;
}
```
#### HTML代码：
```
<a href="#" class="test_outer">
    <span class="test_cover trans"></span>
    <img src="http://image.zhangxinxu.com/image/study/s/s512/mm1.jpg" width="512" height="381" border="0" />
</a>
```
