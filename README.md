<p align="center">
  <img width="128" src="https://github.com/sansui-orz/nmsz/blob/main/images/128x128.png" alt="nmsz logo">
</p>
<br/>

# nmsz(牛马时钟)

牛马时钟，属于打工人的时钟。

解压双击打开后，点击状态栏出现的图标，点击设置，进入设置页面。

在设置页面中，你可以设置月薪，每天的工作时间，每月的工作日期（默认每月周一到周五），是否开机自启。

设置完成后，牛马时钟会根据这些数值计算上班时间里，每分钟的薪资，并更新在状态栏中。

如果你不想别人看到你的薪资详情，你也可以通过下拉菜单中的显示隐藏进行切换显示状态，当然为了防止别人的突袭，我贴心的准备了Control+T的快捷键进行切换。

## 支持平台

- mac (arm/x64) ✅
- windows ❌ (暂未实现)

## 运行

```sh
npm install
npm start
```
如果需要调试设置页面，则需要修改main/main.js中的mainWindow.loadURL为web服务的url。在此之前，先启动web服务：

```sh
cd web
npm install
npm run dev
```

## 打包

默认构建mac arm版本。

```sh
npm run build
```

构建mac int版本

```sh
npm run build:mac:x64
```

如果修改了web，则先构建web

```sh
cd web
npm run build
```

项目很简单，大概看一眼工程就知道了。

### 效果展示

![效果](./images/example.jpg)

![设置](./images/setting.jpg)


