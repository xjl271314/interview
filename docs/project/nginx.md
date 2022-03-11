---
title: nginx
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

## 定义

> Nginx 是一款轻量级的 HTTP 服务器，采用事件驱动的异步非阻塞处理方式框架，时常用于服务端的反向代理和负载均衡。

## nginx 文件介绍

```
├── client_body_temp
├── conf                             # Nginx所有配置文件的目录
│   ├── fastcgi.conf                 # fastcgi相关参数的配置文件
│   ├── fastcgi.conf.default         # fastcgi.conf的原始备份文件
│   ├── fastcgi_params               # fastcgi的参数文件
│   ├── fastcgi_params.default
│   ├── koi-utf
│   ├── koi-win
│   ├── mime.types                   # 媒体类型
│   ├── mime.types.default
│   ├── nginx.conf                   # Nginx主配置文件
│   ├── nginx.conf.default
│   ├── scgi_params                  # scgi相关参数文件
│   ├── scgi_params.default
│   ├── uwsgi_params                 # uwsgi相关参数文件
│   ├── uwsgi_params.default
│   └── win-utf
├── fastcgi_temp                     # fastcgi临时数据目录
├── html                             # Nginx默认站点目录
│   ├── 50x.html                     # 错误页面优雅替代显示文件，例如当出现502错误时会调用此页面
│   └── index.html                   # 默认的首页文件
├── logs                             # Nginx日志目录
│   ├── access.log                   # 访问日志文件
│   ├── error.log                    # 错误日志文件
│   └── nginx.pid                    # pid文件，Nginx进程启动后，会把所有进程的ID号写到此文件
├── proxy_temp                       # 临时目录
├── sbin                             # Nginx命令目录
│   └── nginx                        # Nginx的启动命令
├── scgi_temp                        # 临时目录
└── uwsgi_temp                       # 临时目录
```

### 1. 配置文件（重点）

```js
conf; // nginx所有配置文件目录
nginx.conf; // 核心配置文件
nginx.conf.default; // nginx.conf的备份文件
```

### 2. 日志

```js
logs: 记录入门的文件，当nginx服务器启动后
这里面会有 access.log error.log 和nginx.pid三个文件出现。
```

### 3. 资源目录

```js
html //存放nginx自带的两个静态的html页面
50x.html //访问失败后的失败页面
index.html //成功访问的默认首页
```

### 4. 备份文件

```js
fastcgi.conf:fastcgi  //相关配置文件
fastcgi.conf.default //fastcgi.conf的备份文件
fastcgi_params //fastcgi的参数文件
fastcgi_params.default //fastcgi的参数备份文件
scgi_params //scgi的参数文件
scgi_params.default //scgi的参数备份文件
uwsgi_params //uwsgi的参数文件
uwsgi_params.default //uwsgi的参数备份文件
mime.types //记录的是HTTP协议中的Content-Type的值和文件后缀名的对应关系
mime.types.default //mime.types的备份文件
```

### 5.编码文件

```js
koi-utf、koi-win、win-utf这三个文件都是与编码转换映射相关的配置文件，
用来将一种编码转换成另一种编码
```

### 6. 执行文件

```js
sbin: 是存放执行程序文件nginx;
```

### 7. 命令

```js
nginx: 是用来控制Nginx的启动和停止等相关的命令。
```

## nginx 常用命令

1. 常见 2 种启动命令

   ```js
   > nginx //直接nginx启动，前提是配好nginx环境变量
   > systemctl start nginx.service //使用systemctl命令启动
   ```

2. 常见的 4 种停止命令

   ```js
   > nginx  -s stop //立即停止服务
   > nginx -s quit // 从容停止服务 需要进程完成当前工作后再停止
   > killall nginx //直接杀死nginx进程
   > systemctl stop nginx.service //systemctl停止
   ```

3. 常见的 2 种重启命令

   ```js
   > nginx -s reload //重启nginx
   > systemctl reload nginx.service //systemctl重启nginx
   ```

4. 验证 nginx 配置文件是否正确

   ```js
   > nginx -t //输出nginx.conf syntax is ok即表示nginx的配置文件正确
   ```

## nginx 配置详细介绍

### 1. 配置文件的结构介绍

```bash
worker_processes  1；                			# worker进程的数量
events {                              			# 事件区块开始
    worker_connections  1024；          		# 每个worker进程支持的最大连接数
}                               			    # 事件区块结束
http {                           			    # HTTP区块开始
    include       mime.types；         			# Nginx支持的媒体类型库文件
    default_type  application/octet-stream；    # 默认的媒体类型
    sendfile        on；       				    # 开启高效传输模式
    keepalive_timeout  65；       			    # 连接超时
    server {            		                # 第一个Server区块开始，表示一个独立的虚拟主机站点
        listen       80；      			        # 提供服务的端口，默认80
        server_name  localhost；    			# 提供服务的域名主机名
        location / {            	        	# 第一个location区块开始
            root   html；       			    # 站点的根目录，相当于Nginx的安装目录
            index  index.html index.htm；       # 默认的首页文件，多个用空格分开
        }          				                # 第一个location区块结果
        error_page   500502503504  /50x.html；  # 出现对应的http状态码时，使用50x.html回应客户
        location = /50x.html {          	    # location区块开始，访问50x.html
            root   html；      		      	    # 指定对应的站点目录为html
        }
    }
    ......
```

1. ngxin.conf 相当于是入口文件，nginx 启动后会先从 nginx.conf 里面读取基础配置
2. conf 目录下面的各种 xxx.conf 文件呢，一般就是每一个应用的配置，比如 a 网站的 nginx 配置叫 a.conf，b 网站的叫 b.conf，可以方便我们去便于管理
3. 加载 conf 目录下的配置，在主配置文件 nginx.conf 中，一般会有这么一行代码

### 2.nginx.conf 主配置文件详细介绍

```python
# 运行用户，默认是nginx，可以不进行设置
user nginx;
# Nginx进程，一般设置为何CPU核数一样
worker_processes 1;
# 错误日志存放目录
error_log /var/log/nginx/error.log warn;
# 进程pid存放位置
pid /var/run/nginx.pid;

events {
    worker_connections 1024 # 单个后台进程的最大并发数
}

http {
    ...
}
```

### 3. location 匹配

```python
# 优先级1,精确匹配，根路径
location =/ {
    return 400;
}

# 优先级2,以某个字符串开头,以av开头的，优先匹配这里，区分大小写
location ^~ /av {
    root /data/av/;
}

# 优先级3，区分大小写的正则匹配，匹配/media*****路径
location ~ /media {
    alias /data/static/;
}

# 优先级4 ，不区分大小写的正则匹配，所有的****.jpg|gif|png 都走这里
location ~* .*\.(jpg|gif|png|js|css)$ {
    root  /data/av/;
}

# 优先7，通用匹配
location / {
    return 403;
}
```

## 正向代理与反向代理

> `代理`是在服务器和客户端之间假设的一层服务器，`代理`将接收客户端的请求并将它转发给服务器，然后将服务端的响应转发给客户端。

![正向代理与反向代理](https://img-blog.csdnimg.cn/20200224115629520.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 正向代理

> 一个位于客户端和原始服务器 (origin server) 之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标 (原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。

- 正向代理 是为我们服务的，即为客户端服务的，客户端可以根据正向代理访问到它本身无法访问到的服务器资源。

- 正向代理 对我们是透明的，对服务端是非透明的，即服务端并不知道自己收到的是来自代理的访问还是来自真实客户端的访问。

### 反向代理

> 是指以代理服务器来接受 `internet` 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 `internet` 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

- 反向代理 是为服务端服务的，反向代理可以帮助服务器接收来自客户端的请求，帮助服务器做请求转发，负载均衡等。

- 反向代理 对服务端是透明的，对我们是非透明的，即我们并不知道自己访问的是代理服务器，而服务器知道反向代理在为他服务。

## nginx 基本结构

![nginx基本结构](https://img-blog.csdnimg.cn/20200224133102108.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        location  path {
            ...
        }
    }

    server {
        location  path {
            ...
        }
    }
}

```

- `main`:`nginx`的全局配置，对全局生效。
- `events`: 配置影响 `nginx` 服务器或与用户的网络连接。
- `http`：可以嵌套多个 `server`，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。
- `server`：配置虚拟主机的相关参数，一个 `http` 中可以有多个 `server`。
- `location`：配置请求的路由，以及各种页面的处理情况。
- `upstream`：配置后端服务器具体地址，负载均衡配置不可或缺的部分。

## nginx 内置变量

| 变量名             | 功能                                                                |
| :----------------- | :------------------------------------------------------------------ |
| `$host`            | 请求信息中的 `Host`，如果请求中没有`Host`行，则等于设置的服务器名。 |
| `$request_method`  | 客户端请求类型如 `GET`、`POST`等。                                  |
| `$args`            | 请求中的参数。                                                      |
| `$content_length`  | 请求头中的`Content-length`字段。                                    |
| `$http_user_agent` | 客户端的 agent 信息。                                               |
| `$http_cookie`     | 客户端的 cookie 信息。                                              |
| `$remote_addr`     | 客户端的`IP`地址。                                                  |
| `$remote_port`     | 客户端的端口。                                                      |
| `$server_protocol` | 请求使用的协议如`HTTP/1.1`。                                        |
| `$server_addr`     | 服务器地址。                                                        |
| `$server_name`     | 服务器名称。                                                        |
| `$server_port`     | 服务器端口。                                                        |

## 解决跨域

**跨域的定义**

> 同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。通常不允许不同源间的读操作。

**同源的定义**

> 如果两个页面的协议，端口（如果有指定）和域名都相同，则两个页面具有相同的源。

**nginx 解决跨域的原理**

> nginx 对服务端转发的请求不会触发浏览器的同源策略。

- 前端 server 的域名为：fe.server.com
- 后端服务的域名为：dev.server.com

前端`fe.server.com`发出对`dev.server.com`的请求一定会出现跨域。

我们只需要启动一个 `nginx` 服务器，将`server_name`设置为`fe.server.com`, 然后设置相应的 `location` 以拦截前端需要跨域的请求，最后将请求代理回`dev.server.com`。如下面的配置：

```nginx
server {
    listen  80;
    server_name  fe.server.com;
    location / {
        proxy_pass dev.server.com;
    }
}
```

## nginx 请求过滤

- 根据状态码过滤:

```js
error_page 500 501 502 503 504 506 /50x.html;
location = /50x.html {
    # 将根路径改编为存放 html 的路径。
    root /root/static/html;
}
```

- 根据 URL 名称过滤，精准匹配 URL，不匹配的 URL 全部重定向到主页:

```nginx
location / {
    rewrite  ^.*$ /index.html  redirect;
}
```

- 根据请求类型过滤:

```nginx
if ( $request_method !~ ^(GET|POST|HEAD)$ ) {
    return 403;
}

if ( !-f $request_filename ){
    rewrite (.*) /index.js;
}
```

## 配置 Gzip 压缩

`GZIP`是规定的三种标准 `HTTP` 压缩格式之一。目前绝大多数的网站都在使用`GZIP`传输 `HTML`、`CSS`、`JavaScript` 等资源文件。

对于文本文件，`GZip` 的效果非常明显，开启后传输所需流量大约会降至 1/4 ~ 1/3。

并不是每个浏览器都支持`gzip`的，如何知道客户端是否支持`gzip`呢，请求头中的`Accept-Encoding`来标识对压缩的支持。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200224152406970.png)

启用`gzip`同时需要客户端和服务端的支持，如果客户端支持`gzip`的解析，那么只要服务端能够返回`gzip`的文件就可以启用`gzip`了, 我们可以通过`nginx`的配置来让服务端支持`gzip`。

下面的`respone`中`content-encoding:gzip`，指服务端开启了`gzip`的压缩方式:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200224152655496.png)

```nginx
gzip                    on; // 开启或者关闭gzip模块 默认为off
gzip_http_version       1.1;// 启用 `GZip` 所需的`HTTP`最低版本 默认值为HTTP/1.1
gzip_comp_level         5; // 压缩级别，级别越高压缩率越大，当然压缩时间也就越长（传输快但比较消耗 cpu） 默认值为 1 压缩级别取值为1-9
gzip_min_length         1000;// 设置允许压缩的页面最小字节数，Content-Length小于该值的请求将不会被压缩 默认值:0  当设置的值较小时，压缩后的长度可能比原文件大，建议设置1000以上
gzip_types              text/csv text/xml text/css text/plain text/javascript application/javascript application/x-javascript application/json application/xml; // 要采用 gzip 压缩的文件类型 (MIME类型)  默认值:text/html(默认不压缩js/css)
```

## 负载均衡

> 负载均衡就是用来帮助我们将众多的客户端请求合理的分配到各个服务器，以达到服务端资源的充分利用和更少的请求时间。

**Upstream 指定后端服务器地址列表**

```nginx
upstream balanceServer {
    server 10.1.22.33:12345;
    server 10.1.22.34:12345;
    server 10.1.22.35:12345;
}
```

**在 server 中拦截响应请求，并将请求转发到 Upstream 中配置的服务器列表。**

```nginx
server {
    server_name  fe.server.com;
    listen 80;
    location /api {
        proxy_pass http://balanceServer;
    }
}
```

上面的配置只是指定了 `nginx` 需要转发的服务端列表，并没有指定分配策略。

**- 轮询策略**

默认情况下采用的策略，将所有客户端请求轮询分配给服务端。

这种策略是可以正常工作的，但是如果其中某一台服务器压力太大，出现延迟，会影响所有分配在这台服务器下的用户。

**- 最小连接数策略**

将请求优先分配给压力较小的服务器，它可以平衡每个队列的长度，并避免向压力大的服务器添加更多的请求。

```nginx
upstream balanceServer {
    least_conn;
    server 10.1.22.33:12345;
    server 10.1.22.34:12345;
    server 10.1.22.35:12345;
}
```

**- 最快响应时间策略**

依赖于 `NGINX Plus`，优先分配给响应时间最短的服务器。

```nginx
upstream balanceServer {
    fair;
    server 10.1.22.33:12345;
    server 10.1.22.34:12345;
    server 10.1.22.35:12345;
}
```

**- 客户端 ip 绑定**

来自同一个 `ip`的请求永远只分配一台服务器，有效解决了动态网页存在的 `session` 共享问题。

```nginx
upstream balanceServer {
    ip_hash;
    server 10.1.22.33:12345;
    server 10.1.22.34:12345;
    server 10.1.22.35:12345;
}
```

## 静态资源服务器

```nginx
location ~* \.(png|gif|jpg|jpeg)$ {
    root    /root/static/;
    autoindex on;
    access_log  off;
    expires     10h;# 设置过期时间为 10 小时
}
```

匹配以`png|gif|jpg|jpeg`为结尾的请求，并将请求转发到本地路径，`root`中指定的路径即 `nginx` 本地路径。同时也可以进行一些缓存的设置。
