import React, { Component } from "react";
import Code from "../../components/CodeBlock";
import Title from "../../components/Title";

const code1 = `echo "FROM ubuntu:latest

RUN apt update && apt install -y tshark curl jq xxd
" > Dockerfile
`;

const code2 = `echo "version: '3'

services:
  nginx:
    image: nginx:1.11
    volumes:
      - ./nginx:/etc/nginx

  client:
    image: ubuntu-tshark
    command: [tail, -f, /dev/null]
    cap_add:
      - NET_ADMIN
" > docker-compose.yml
`;

const code3 = `mkdir nginx
echo "events {}

http {
    server {
        listen 80;

        location / {
            root /usr/share/nginx/html;
        }
    }
}
" > ./nginx/nginx.conf`

const code4 = `docker-compose up -d`

const code5 = `docker exec -it $(docker ps | grep client | awk '{print $1}') bash
root@8de4fbf00574:$ tshark -i eth0 -w eth0.pcap`;

const code7 = `docker exec -it $(docker ps | grep client | awk '{print $1}') bash
root@8de4fbf00574:$ curl nginx`;

const output1 = `1       172.23.0.2      172.23.0.3      TCP     39586 → 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 SACK_PERM=1 TSval=2444991719 TSecr=0 WS=128
2       172.23.0.3      172.23.0.2      TCP     80 → 39586 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0 MSS=1460 SACK_PERM=1 TSval=1011677901 TSecr=2444991719 WS=128
3       172.23.0.2      172.23.0.3      TCP     39586 → 80 [ACK] Seq=1 Ack=1 Win=64256 Len=0 TSval=2444991719 TSecr=1011677901
4       172.23.0.2      172.23.0.3      HTTP    GET / HTTP/1.1
5       172.23.0.3      172.23.0.2      TCP     80 → 39586 [ACK] Seq=1 Ack=70 Win=65152 Len=0 TSval=1011677901 TSecr=2444991719
6       172.23.0.3      172.23.0.2      HTTP    HTTP/1.1 200 OK  (text/html)
7       172.23.0.2      172.23.0.3      TCP     39586 → 80 [ACK] Seq=70 Ack=852 Win=64128 Len=0 TSval=2444991719 TSecr=1011677901
8       172.23.0.2      172.23.0.3      TCP     39586 → 80 [FIN, ACK] Seq=70 Ack=852 Win=64128 Len=0 TSval=2444991719 TSecr=1011677901
9       172.23.0.3      172.23.0.2      TCP     80 → 39586 [FIN, ACK] Seq=852 Ack=71 Win=65152 Len=0 TSval=1011677901 TSecr=2444991719
10      172.23.0.2      172.23.0.3      TCP     39586 → 80 [ACK] Seq=71 Ack=853 Win=64128 Len=0 TSval=2444991719 TSecr=1011677901
`;

const output2 = `474554202f20485454502f312e310d0a486f73743a206e67696e780d0a557365722d4167656e743a206375726c2f372e38312e300d0a4163636570743a202a2f2a0d0a0d0a`;

const output3 = `GET / HTTP/1.1
Host: nginx
User-Agent: curl/7.81.0
Accept: */*`;

const output4 = `<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
`;

const output5 = `RSA Private-Key: (2048 bit, 2 primes)
modulus:
    00:d0:4a:0e:cd:e3:fc:86:29:5c:02:9a:a2:28:f7:
    5e:4f:e9:61:16:6c:39:07:19:ba:a8:e2:7b:78:18:
    a6:c2:25:2a:82:7e:4c:cc:b1:f8:af:7b:67:5c:b9:
    f8:9b:5a:30:cc:13:fb:25:6c:ac:a5:c1:b8:20:b8:
    cc:de:67:48:95:4b:ac:73:50:e7:f6:65:75:f3:a8:
    ed:bb:52:91:19:17:eb:87:2a:a3:5c:6b:33:ac:08:
    82:9f:b5:93:19:3f:05:c3:2b:93:75:a5:b6:2a:83:
    ef:5b:12:fa:fd:e5:a0:d2:ac:b9:0d:e6:94:00:82:
    03:0d:16:a4:7a:ee:de:d7:64:e8:ad:93:24:33:22:
    a1:7d:04:61:75:e6:45:39:b3:0d:d0:8e:9b:a6:ae:
    ed:5e:d4:c2:bc:28:4c:c2:9a:16:74:6f:bf:36:d9:
    27:01:b0:8b:8d:6c:b9:66:97:13:a4:d2:73:a2:5b:
    61:a2:45:24:88:e5:5c:88:a5:30:05:c5:73:ea:59:
    e5:41:4f:37:d1:de:2d:24:55:bb:17:c5:97:73:be:
    44:b1:40:aa:b9:4b:7e:f9:0e:68:b9:56:dd:06:19:
    75:cc:4d:de:5f:e8:95:5a:42:1d:b7:d2:eb:fb:a4:
    2b:90:86:85:b7:c5:db:63:b2:53:32:1b:94:2a:fb:
    36:3d
publicExponent: 65537 (0x10001)
privateExponent:
    22:e7:26:0f:ee:52:54:90:fd:b0:1a:05:6e:63:f5:
    53:e2:c1:b8:26:2e:70:38:29:85:3f:5e:7d:43:74:
    3e:38:48:25:51:d0:c0:c4:59:ed:dd:f9:f6:19:db:
    c4:fc:9a:0c:b8:94:6f:33:04:c3:49:f0:f6:da:c0:
    c9:cb:f8:e7:bb:a4:8c:36:54:88:7f:7c:02:76:9e:
    4f:b3:88:48:f2:2f:2f:99:3f:82:af:1c:1b:89:d9:
    89:b5:bd:8e:8f:77:01:bb:7d:9c:4b:46:79:5d:5e:
    70:9e:7f:9c:a8:2c:08:e1:94:a8:f5:a8:7b:65:4d:
    e9:95:8f:be:61:e4:c9:a6:fb:c6:b2:77:84:46:34:
    1c:4d:da:27:17:9d:d4:ab:2c:a7:c3:75:4a:fd:1c:
    31:19:d0:10:b4:84:e4:ae:75:8c:ab:4e:a1:05:b0:
    e8:68:15:ff:73:7f:f5:d3:aa:4b:1c:31:31:bc:b1:
    50:22:0e:37:12:4b:b3:f6:74:a6:02:ad:d6:64:88:
    76:de:14:ea:6a:7b:b7:1d:2c:55:46:82:7d:7d:58:
    5e:e5:84:ad:ff:a1:5d:d1:8d:4a:35:77:b3:b1:1d:
    18:c7:c0:ca:03:05:33:db:76:5a:af:b3:18:51:69:
    e4:74:c7:8e:0e:c3:2e:32:21:3d:fe:5f:81:96:9d:
    81
prime1:
    00:eb:9a:07:07:84:25:33:1f:bf:f8:da:2a:fd:6a:
    26:45:57:ec:4b:3b:ad:fb:f8:3c:c5:b8:90:6e:9e:
    82:21:95:46:7a:73:33:a5:29:e7:e0:95:9a:cd:35:
    63:60:48:64:8b:02:f9:44:63:ce:19:66:29:2b:cb:
    94:56:ed:6d:ac:ee:c0:21:7a:55:53:bd:a2:5e:c4:
    61:63:d3:33:9a:f9:bd:ba:f0:1f:8f:fd:82:44:0b:
    d5:19:e6:c0:2a:17:9d:66:eb:4a:87:79:b7:2a:1a:
    cf:fc:da:4c:0d:ea:c2:0d:7e:09:f4:72:7d:f0:60:
    07:d3:a7:f9:21:08:3f:4c:31
prime2:
    00:e2:52:aa:e0:9e:12:a2:91:9f:d2:be:78:5b:56:
    ae:d5:2d:56:57:ba:28:73:60:94:53:1c:c1:5e:d5:
    ec:8b:da:6e:b4:6a:67:b0:3a:b1:29:3b:03:7e:c9:
    62:51:cf:6f:11:2f:66:84:d1:7a:64:63:da:91:d8:
    79:c7:82:00:e0:bd:5a:1b:29:0e:39:1b:01:fd:fc:
    29:c8:44:bc:b2:7c:e5:80:30:fa:3b:55:59:d1:aa:
    e8:05:36:63:5e:d8:75:ca:dc:3c:e1:76:e9:50:3b:
    bf:48:4d:ca:6d:6d:6a:63:4e:fc:67:6e:70:c6:c4:
    52:b8:f9:85:db:e5:48:a3:cd
exponent1:
    75:7c:7c:ae:e1:d5:cf:15:b1:1c:7e:66:db:b2:18:
    5d:92:07:b2:48:93:6d:48:0f:be:25:58:58:e1:50:
    51:40:e8:41:5d:bb:4e:4c:84:65:f9:14:95:ea:5e:
    a0:ff:d8:ab:7d:93:21:e8:87:39:21:39:bc:ae:2b:
    4d:e1:de:44:53:56:9a:1b:2f:fb:af:60:0d:d3:ee:
    20:e2:8c:24:67:0f:96:ed:f1:3f:53:92:a7:2e:23:
    59:64:39:45:84:3b:28:bc:82:90:e6:40:51:8d:c7:
    53:f6:e3:e0:38:c6:06:06:69:1e:6e:0d:a1:55:b1:
    f1:79:1d:01:bc:e4:1b:b1
exponent2:
    04:50:31:03:80:df:b8:0b:70:71:52:c1:f6:73:ab:
    77:52:9a:df:a7:23:98:37:51:fc:57:82:f3:ec:bd:
    ca:58:8a:5d:93:dd:90:05:3e:55:1b:d3:d0:39:c4:
    4e:ec:d6:20:0c:b8:36:75:cb:90:58:3a:d5:26:bc:
    03:6a:5d:db:ea:9f:e9:fe:99:4f:cb:4c:f9:6b:31:
    dc:a8:3a:b4:68:1e:f3:97:7b:5d:60:1e:0b:19:e7:
    bc:19:b2:41:1f:7c:f7:35:c5:4f:42:b5:e5:9a:8d:
    e5:b1:dd:d6:c2:0c:12:02:72:5b:02:46:d1:f2:f1:
    e4:a6:94:bf:81:1a:26:4d
coefficient:
    40:12:7b:85:e1:9f:c2:e1:e2:94:e9:7f:fd:11:9a:
    07:b9:e1:db:c0:db:6a:4a:2a:ba:52:05:dd:08:12:
    81:51:98:95:a2:3e:8d:d6:a3:f5:92:c2:a7:1b:f2:
    31:fe:ef:0b:44:a5:ed:21:39:96:e5:11:73:ab:ff:
    c2:61:1b:d2:e0:5a:30:31:d2:ec:db:89:24:7c:b3:
    ee:f1:40:ba:4b:25:d5:b5:60:89:82:85:8b:20:9d:
    3a:54:41:3d:6d:0c:40:36:97:50:c6:7c:e8:bf:60:
    9f:76:57:3f:52:84:95:a5:21:b0:32:02:e6:5b:26:
    ed:a0:29:42:0e:f5:36:aa
`;

const output6 = `Cipher Suites Length: 62
Cipher Suites (31 suites)
    Cipher Suite: TLS_AES_256_GCM_SHA384 (0x1302)
    Cipher Suite: TLS_CHACHA20_POLY1305_SHA256 (0x1303)
    Cipher Suite: TLS_AES_128_GCM_SHA256 (0x1301)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 (0xc02c)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
--
Extension: encrypt_then_mac (len=0)
    Type: encrypt_then_mac (22)
    Length: 0
Extension: extended_master_secret (len=0)
    Type: extended_master_secret (23)
    Length: 0`;

const output7 = `Random: e0202c9876e61e949120e7faf76e8fddf412438431a94b737645e11f5e77aaf0
    GMT Unix Time: Feb 25, 2089 21:22:32.000000000 UTC
    Random Bytes: 76e61e949120e7faf76e8fddf412438431a94b737645e11f5e77aaf0`;
  
const output8 = `Cipher Suite: TLS_RSA_WITH_AES_256_CBC_SHA (0x0035)
Extension: renegotiation_info (len=1)
Extension: next_protocol_negotiation (len=9)`;

const output9 = `"pkcs1.modulus_raw": [
  "00d04a0ecde3fc86295c029aa228f75e4fe961166c390719baa8e27b7818a6c2252a827e4cccb1f8af7b675cb9f89b5a30cc13fb256caca5c1b820b8ccde6748954bac7350e7f66575f3a8edbb52911917eb872aa35c6b33ac08829fb593193f05c32b9375a5b62a83ef5b12fafde5a0d2acb90de6940082030d16a47aeeded764e8ad93243322a17d046175e64539b30dd08e9ba6aeed5ed4c2bc284cc29a16746fbf36d92701b08b8d6cb9669713a4d273a25b61a2452488e55c88a53005c573ea59e5414f37d1de2d2455bb17c59773be44b140aab94b7ef90e68b956dd061975cc4dde5fe8955a421db7d2ebfba42b908685b7c5db63b253321b942afb363d",
--
"pkcs1.publicExponent_raw": [
  "010001",`;
  
const output10 = `Random: a5db67c1c72f80d6ef48a10f291343f617f3b54912c3e4b09950a5e25f4dc6c0
GMT Unix Time: Mar  6, 2058 05:53:05.000000000 UTC
Random Bytes: c72f80d6ef48a10f291343f617f3b54912c3e4b09950a5e25f4dc6c0`;

const output11 = `RSA Encrypted PreMaster Secret
Encrypted PreMaster length: 256
Encrypted PreMaster: b1960fce510bb03ee6f587a8ea18b16a3a17dc8521f8be37e66aa737bf25fc2d3ba2b562…`;

const output12 = `b1960fce510bb03ee6f587a8ea18b16a3a17dc8521f8be37e66aa737bf25fc2d3ba2b562ded2ce2c97f68b681e10d7069ae0e98ba866c1225ac07055d2f7d3f6ae38efa41808bc15821bdea4e13211953856346a53aa8c081b8873561f78045d518e8cefcae9912da0d279f3672595f2309b2b4c3b290af198cf7381dd7cfc5432b38f935c7d286b36153d724c6aca1e822b2f0789336efdc5da13e17f9536e51f4fcaee1e5ccb1cec9334c60a89deb6bf09ef45c290f39510825a755ed10fec00068e31b58ea7f11ad704ceca07b8a09460837946521445ada7c03f137d291376c255e74c76c867fcc7b2e61c1b607aa1b345026af5ef02381e1ae504a4e6e0`;

const output13 = `9c64a77100430d39ee42a3c30e94872644b6957a5c610592060f93a6a84d5135494632097fea98f58a0686fbce883ebebc4b248ef389c41925192eec7893cabbd502acfec9809304f82934c59617e9e09457bb13cf696e898aa9c3feb29ec408cdcbfcb444653426687473d839f2ee5f`;

const output14 = `ac67af180a5b97b1c49f9a4f172bdddb0689aab38e414160eae09d33ff97f1f024f701798d8069c3e31fe50e6a8868ee23f6360f5148f32e0dcb5fd1a9233fe4c85adeab695ca8729cdc9f82628c408f3704348a1be3b13827b94a5d12774c7748506823623235268afbea2633ace78709d3ed05d905cb8309cad636edd1601552df16f630da4e3f835b03fa3aac6b781e18a6d466d4492766699555a1b504793cf7edaf9374345a2947c128c47bad1677f2e0cd79f5ad649130e543de046c124f55361b0642344fc6bd7504d6be47995f8af8f125e2f13e8625a42322698e7b0a1bfa937c92ca1536fe6f4a0c836008513da835c59bf0ec12b4db7a0334b5c0136886052cbe5fc0e495522e6084d15777f192dddb098564f1f8b0e6171b96049fc014b2fbb984f80e882936ca5b100de6f145c810188cacdf46f6af4b1cf01b89737284e8657a7e7fc9d85b5d2d3d38e945d6ca89bf81aada2985d3e0b9debad7601aeaeb2e14d0c856c4f8b3413d0d5db8357c3115d6fae05da59eb8a8998bc450fc43887787061d099e1485125d773bf3aee5c20b44a1d4f7a844249481373da36cccb4b8048d97ad7cb096f4a947c6fab021bc5c594ae48ced4779919680d46761a328e8cd4eb2bacc545c916a8be2206d125d53612f5ba78f61952be885c03cdabe618b77dace871bac6bc57de439b77a641b4c0abddb53be2203b118a000d93124f5e566276baccb2e3e464dac9fc914e61d4e7b493c7efa8d0cd94a8d38179ec61a5f1782864b65b3a677e8366667c89d72a1ddd27d8797fb30e74e30c87cf768cabdaa7a9129884c4fb1b80abe27c421cbb9c4ab43695e03c8eaceaef69a4d243d25cd93d28ebbac6b3f250b22ca05a9110c49f1751fda30104bc668a6a121200d3f9765aee8750506a470c0ec599f7d1f0d0d4bc99683e9b9192c78746e56eb4a0cfd7be980779de777d6dacbb3f7c2bbbb1139bde68e3f6224585233a0746b3eb1df5a35b20576d1686bc71d26cf28280dfcc0bc8157f7a16fd628989652be18373faaa81e77b2b3ee059c413999c09992f4554cfe627b2a5391ffbbef86268da35aea2707f94a9262282294d076512ba49051d889c250316bd554a72792441de90ef3d5bf000f851fccfce6c28c106765a4442ee91f855b1e4ba95c6920353e5a976d54d54724de7e9e87a31c66c36d633590ad0653f0795522d5137295a2b23d2197d2da7e618f75a68e45d73f61eaae41c28f0c990e69da71ea`;

const output15 = `1       172.23.0.2      172.23.0.3      TCP     43586 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 SACK_PERM=1 TSval=2454370928 TSecr=0 WS=128
2       172.23.0.3      172.23.0.2      TCP     443 → 43586 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0 MSS=1460 SACK_PERM=1 TSval=1021057110 TSecr=2454370928 WS=128
3       172.23.0.2      172.23.0.3      TCP     43586 → 443 [ACK] Seq=1 Ack=1 Win=64256 Len=0 TSval=2454370928 TSecr=1021057110
4       172.23.0.2      172.23.0.3      TLSv1   Client Hello
5       172.23.0.3      172.23.0.2      TCP     443 → 43586 [ACK] Seq=1 Ack=518 Win=64768 Len=0 TSval=1021057111 TSecr=2454370929
6       172.23.0.3      172.23.0.2      TLSv1.2 Server Hello, Certificate, Server Hello Done
7       172.23.0.2      172.23.0.3      TCP     43586 → 443 [ACK] Seq=518 Ack=1047 Win=64128 Len=0 TSval=2454370930 TSecr=1021057112
8       172.23.0.2      172.23.0.3      TLSv1.2 Client Key Exchange, Change Cipher Spec, Encrypted Handshake Message, Encrypted Handshake Message
9       172.23.0.3      172.23.0.2      TCP     443 → 43586 [ACK] Seq=1047 Ack=945 Win=64384 Len=0 TSval=1021057112 TSecr=2454370930
10      172.23.0.3      172.23.0.2      TLSv1.2 Change Cipher Spec, Encrypted Handshake Message
11      172.23.0.2      172.23.0.3      TCP     43586 → 443 [ACK] Seq=945 Ack=1122 Win=64128 Len=0 TSval=2454370931 TSecr=1021057113
12      172.23.0.2      172.23.0.3      TLSv1.2 Application Data
13      172.23.0.3      172.23.0.2      TCP     443 → 43586 [ACK] Seq=1122 Ack=1062 Win=64384 Len=0 TSval=1021057113 TSecr=2454370931
14      172.23.0.3      172.23.0.2      TLSv1.2 Application Data
15      172.23.0.2      172.23.0.3      TCP     43586 → 443 [ACK] Seq=1062 Ack=2023 Win=64128 Len=0 TSval=2454370932 TSecr=1021057114
16      172.23.0.2      172.23.0.3      TLSv1.2 Encrypted Alert
17      172.23.0.3      172.23.0.2      TCP     443 → 43586 [ACK] Seq=2023 Ack=1115 Win=64384 Len=0 TSval=1021057114 TSecr=2454370932
18      172.23.0.2      172.23.0.3      TCP     43586 → 443 [FIN, ACK] Seq=1115 Ack=2023 Win=64128 Len=0 TSval=2454370932 TSecr=1021057114
19      172.23.0.3      172.23.0.2      TCP     443 → 43586 [FIN, ACK] Seq=2023 Ack=1115 Win=64384 Len=0 TSval=1021057114 TSecr=2454370932
20      172.23.0.2      172.23.0.3      TCP     43586 → 443 [ACK] Seq=1116 Ack=2024 Win=64128 Len=0 TSval=2454370932 TSecr=1021057114
21      172.23.0.3      172.23.0.2      TCP     443 → 43586 [ACK] Seq=2024 Ack=1116 Win=64384 Len=0 TSval=1021057114 TSecr=2454370932`;

const code8 = `root@8de4fbf00574:$ tshark -r eth0.pcap -T fields \\
> -e frame.number -e ip.src -e ip.dst -e _ws.col.Protocol -e _ws.col.Info`;

const code9 = `root@8de4fbf00574:$ tshark -r eth0.pcap -Y "frame.number == 4" \\
-T jsonraw | jq -r '.[0]._source.layers.http_raw[0]'`;

const code10 = `root@8de4fbf00574:$ tshark -r eth0.pcap -Y "frame.number == 4" \\
-T jsonraw | jq -r '.[0]._source.layers.http_raw[0]' | xxd -r -p`;

const code11 = `root@8de4fbf00574:$ tshark -r eth0.pcap -Y "frame.number == 6" \\
-T jsonraw | jq -r '.[0]._source.layers.http."http.file_data_raw"[0]' | xxd -r -p`;

const code12 = `mkdir nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/certs/nginx.key \\
-out ./nginx/certs/nginx.crt -subj "/C=IN/ST=Kerala/L=Trivandrum/O=Hacking/CN=hacking.com"`;

const code13 = `echo "events {}

http {
    server {
        listen 80;

        location / {
            root /usr/share/nginx/html;
        }
    }

    server {
        listen 443 ssl;

        ssl_certificate /etc/nginx/certs/nginx.crt;
        ssl_certificate_key /etc/nginx/certs/nginx.key;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        ssl_ciphers 'RSA+SHA';

        location / {
            root   /usr/share/nginx/html;
        }
    }
}
" > nginx/nginx.conf`;

const code14 = `docker-compose down
docker-compose up -d
docker exec -it $(docker ps | grep client | awk '{print $1}') bash
root@3bdb5bc5fa48:$ tshark -i eth0 -w eth0.pcap`;

const code15 = "root@3bdb5bc5fa48:$ curl -k https://nginx:443";

const code16 = `root@3bdb5bc5fa48:$ tshark -r eth0.pcap -T fields -e frame.number -e ip.src -e ip.dst \\
-e _ws.col.Protocol -e _ws.col.Info`;

const code17 = `root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 4" \\
-V | grep -e "Cipher Suites" -A5 -e "Extension: encrypt_then_mac" -A5`;

const code18 = `root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 6" \\
-T jsonraw | grep -e modulus -A1 -e Exponent -A1`;

const code19 = 'root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 12" -T fields -e "tls.app_data"';

const code20 = 'root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 14" -T fields -e "tls.app_data"';

const code21 = `from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5

epms_encrypted = "b1960fce510bb03ee6f587a8ea18b16a3a17dc8521f8be37e66aa737bf25fc2d3ba2b562ded2ce2c97f68b681e10d7069ae0e98ba866c1225ac07055d2f7d3f6ae38efa41808bc15821bdea4e13211953856346a53aa8c081b8873561f78045d518e8cefcae9912da0d279f3672595f2309b2b4c3b290af198cf7381dd7cfc5432b38f935c7d286b36153d724c6aca1e822b2f0789336efdc5da13e17f9536e51f4fcaee1e5ccb1cec9334c60a89deb6bf09ef45c290f39510825a755ed10fec00068e31b58ea7f11ad704ceca07b8a09460837946521445ada7c03f137d291376c255e74c76c867fcc7b2e61c1b607aa1b345026af5ef02381e1ae504a4e6e0"
epms_encrypted = bytes.fromhex(epms_encrypted)

priv_key = open("nginx.key", "r").read()
rsa_key = RSA.importKey(priv_key)
rsa = PKCS1_v1_5.new(rsa_key)

epms_original = rsa.decrypt(epms_encrypted, "failure")
print(f"Pre-Master Secret: {epms_original}")`;

const code22 = `epms_encrypted_int = int.from_bytes(epms_encrypted, "big")
epms = pow(epms_encrypted_int, rsa_key.d, rsa_key.n)
epms = bytes.fromhex(hex(epms)[2:].zfill(512))
epms = epms[-48:]

assert epms == epms_original`;

const code23 = `from Crypto.Hash import HMAC, SHA256

def hmac(secret, data):
    hmac_o = HMAC.new(secret, digestmod=SHA256)
    hmac_o.update(data)
    return hmac_o.digest()

def p_hash(secret, seed, n):
    def A(i):
        return seed if i == 0 else hmac(secret, A(i - 1))
    
    out = b""
    for j in range(1, n + 1):
        out += hmac(secret, A(j) + seed)
        
    return out

def prf(secret, label, seed, n):
    return p_hash(secret, label + seed, n)

client_random = "e0202c9876e61e949120e7faf76e8fddf412438431a94b737645e11f5e77aaf0"
server_random = "a5db67c1c72f80d6ef48a10f291343f617f3b54912c3e4b09950a5e25f4dc6c0"
server_random = bytes.fromhex(server_random)
client_random = bytes.fromhex(client_random)

ms = prf(epms, b"master secret", client_random + server_random, n=2)[:48]
print(f"Master Secret: {ms}")`;

const code24 = `key_block = prf(ms, b"key expansion", server_random + client_random, n=4)

# 0 - 40 is for client MAC and server MAC
client_key = key_block[40:72]
server_key = key_block[72:104]`;

const code25 = `from Crypto.Util.Padding import unpad

def decrypt_then_remove_mac(encrypted_data, key):
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]

    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_data = cipher.decrypt(ciphertext)
    unpadded = unpad(decrypted_data, AES.block_size)
    
    return unpadded[:-20] # Remove MAC

ct = "9c64a77100430d39ee42a3c30e94872644b6957a5c610592060f93a6a84d5135494632097fea98f58a0686fbce883ebebc4b248ef389c41925192eec7893cabbd502acfec9809304f82934c59617e9e09457bb13cf696e898aa9c3feb29ec408cdcbfcb444653426687473d839f2ee5f"
ct_response = "ac67af180a5b97b1c49f9a4f172bdddb0689aab38e414160eae09d33ff97f1f024f701798d8069c3e31fe50e6a8868ee23f6360f5148f32e0dcb5fd1a9233fe4c85adeab695ca8729cdc9f82628c408f3704348a1be3b13827b94a5d12774c7748506823623235268afbea2633ace78709d3ed05d905cb8309cad636edd1601552df16f630da4e3f835b03fa3aac6b781e18a6d466d4492766699555a1b504793cf7edaf9374345a2947c128c47bad1677f2e0cd79f5ad649130e543de046c124f55361b0642344fc6bd7504d6be47995f8af8f125e2f13e8625a42322698e7b0a1bfa937c92ca1536fe6f4a0c836008513da835c59bf0ec12b4db7a0334b5c0136886052cbe5fc0e495522e6084d15777f192dddb098564f1f8b0e6171b96049fc014b2fbb984f80e882936ca5b100de6f145c810188cacdf46f6af4b1cf01b89737284e8657a7e7fc9d85b5d2d3d38e945d6ca89bf81aada2985d3e0b9debad7601aeaeb2e14d0c856c4f8b3413d0d5db8357c3115d6fae05da59eb8a8998bc450fc43887787061d099e1485125d773bf3aee5c20b44a1d4f7a844249481373da36cccb4b8048d97ad7cb096f4a947c6fab021bc5c594ae48ced4779919680d46761a328e8cd4eb2bacc545c916a8be2206d125d53612f5ba78f61952be885c03cdabe618b77dace871bac6bc57de439b77a641b4c0abddb53be2203b118a000d93124f5e566276baccb2e3e464dac9fc914e61d4e7b493c7efa8d0cd94a8d38179ec61a5f1782864b65b3a677e8366667c89d72a1ddd27d8797fb30e74e30c87cf768cabdaa7a9129884c4fb1b80abe27c421cbb9c4ab43695e03c8eaceaef69a4d243d25cd93d28ebbac6b3f250b22ca05a9110c49f1751fda30104bc668a6a121200d3f9765aee8750506a470c0ec599f7d1f0d0d4bc99683e9b9192c78746e56eb4a0cfd7be980779de777d6dacbb3f7c2bbbb1139bde68e3f6224585233a0746b3eb1df5a35b20576d1686bc71d26cf28280dfcc0bc8157f7a16fd628989652be18373faaa81e77b2b3ee059c413999c09992f4554cfe627b2a5391ffbbef86268da35aea2707f94a9262282294d076512ba49051d889c250316bd554a72792441de90ef3d5bf000f851fccfce6c28c106765a4442ee91f855b1e4ba95c6920353e5a976d54d54724de7e9e87a31c66c36d633590ad0653f0795522d5137295a2b23d2197d2da7e618f75a68e45d73f61eaae41c28f0c990e69da71ea"
ct = bytes.fromhex(ct)
ct_response = bytes.fromhex(ct_response)

pt = decrypt_then_remove_mac(ct, client_key)
print("Request:")
print(pt)

print("\\nResponse:")
pt_response = decrypt_then_remove_mac(ct_response, server_key)
print(pt_response)`;

export default class extends Component {
  render() {
    return (
      <article className="content">
        <Title
          title={this.props.title}
          date={this.props.date}
          cat={this.props.cat}
        />
        <section>
          <p>
            On the surface, enabling HTTPS in your website is easy. Simply generate a signed certificate, upload it to your web server, and instruct it to authenticate each request based on the credentials in the certificate. However, what's happening under the hood? This post aims to unravel the intricacies of how TLS, the foundational protocol of HTTPS, facilitates the creation of a secure channel between two entities. To ease into the topic, we will first examine HTTP traffic using tshark, Wireshark's cousin from the command-line, before progressing to the setup of HTTPS and the decryption of intercepted traffic using the private key.
          </p>
        </section>
        <section>
          <h1 className="space">Section 0: Setup</h1>
          <p>
          Suppose there are two individuals, Alice and Bob, attempting to communicate through an unsecured channel, such as HTTP, and Charles, an adversary attempting to eavesdrop on this communication. To emulate this scenario, we will set up two Docker containers: one running an Ubuntu root file system for Alice and Charles, and another hosting an Nginx server for Bob.
          </p>
          <p className="space warning-box">
            Why Docker? Why not run all this on the host machine? Docker makes network-level isolation easy. This results in predictable packet flow and clutter-free packet captures. Moreover, Docker's filesystem-level isolation allows us to peek into old and insecure versions of web servers using broken protocols without having to worry about exposing our host machine to threats.
          </p>
          <p>
            Alice and Charlie's container is a modified Ubuntu with tshark and some other utilities.
          </p>
          <Code>{code1}</Code>
          <p>
            Let's build this container and call it <span class="code-block">ubuntu-tshark</span>.
          </p>
          <Code>docker build -t ubuntu-tshark .</Code>
          <p>
            Next, let's embed this container in a <span class="code-block">docker-compose.yml</span>.
          </p>
          <Code>{code2}</Code>
          <p>Here are a couple of things to note.</p>
          <ol>
            <li>
              We're using an ancient version of Nginx to disable <a href="https://www.ietf.org/rfc/rfc7627.html">Extended Master Secrets</a> (more on this later).
            </li>
            <li>
              We've added the <span class="code-block">NET_ADMIN</span> capability to our Ubuntu container so that we (Charlie) can sniff traffic.
            </li>
          </ol>
          <p>
            Finally, here's a minimal Nginx conf to listen on port 80 and serve a web page.
          </p>
          <Code>{code3}</Code>
          <p>
            Finally, let's create our network.
          </p>
          <Code>{code4}</Code>
        </section>
        <section>
          <h1 className="space">Section 1: HTTP Traffic Capture</h1>
          <p>
            Before sending a request from Alice to Bob, let's start a packet capture on <span class="code-block">eth0</span> in the Ubuntu container.
          </p>
          <Code>{code5}</Code>
          <p>
            In a separate Ubuntu shell, let's <span class="code-block">curl</span> Bob's nginx.
          </p>
          <Code>{code7}</Code>
          <p>
            Back in our first shell, we can now stop the packet capture and analyze the traffic.
          </p>
          <Code className="code-top">{code8}</Code>
          <pre className="box-bottom">
            {output1}
          </pre>
          <p>
            There are a total of 10 TCP and HTTP packets involved in that single HTTP request and we'll analyze them in a bit. But first, where are the DNS queries? Surely, there's got to be a DNS lookup because we <span class="code-block">curl</span>ed nginx and not its IP address. As it turns out, Docker's embedded DNS server is available in the loopback subnet (<span class="code-block">127.0.0.11</span> for me), so the packets will not be sent over the <span class="code-block">eth0</span> interface. To capture this traffic, listen on the loopback interface using <span className="code-block">tshark -i lo -w lo.pcap</span>.
          </p>
          <p>
            Back to the TCP packets, the first three of which constitute the TCP handshake. Note the source <span class="code-block">172.23.0.2:39586</span>, destination <span class="code-block">172.23.0.3:80</span>, and <span class="code-block">SYN</span>, <span class="code-block">SYN/ACK</span>, and <span class="code-block">ACK</span> sequence. The final three packets, <span class="code-block">FIN/ACK</span>, <span class="code-block">FIN/ACK</span>, and <span class="code-block">ACK</span> gracefully close the connection, so that leaves us with only packets 4, 5, 6, and 7. Packet 4 is the GET request from the client and packet 5 is its acknowledgement. Similarly, packet 6 is the response from the server and packet 7 is its acknowledgement.
          </p>
          <p>
            Since this is a regular HTTP request, it's straightforward to extract the payload from packet 4.
          </p>
          <Code className="code-top">{code9}</Code>
          <pre className="box-bottom">
            {output2}
          </pre>
          <p>
            Here we've used the <span class="code-block">jsonraw</span> output format (because tshark`truncates outputs otherwise) before extracting the relevant fields using <span class="code-block">jq</span>. Here's how to get the readable version:
          </p>
          <Code className="code-top">{code10}</Code>
          <pre className="box-bottom">
            {output3}
          </pre>
          <p>
            Similarly, we can extract the response from packet 6.
          </p>
          <Code className="code-top">{code11}</Code>
          <pre className="box-bottom">
            {output4}
          </pre>
        </section>
        <section>
          <h1 className="big-space">Section 2: HTTPS Traffic Capture</h1>
          <p>
            Now that we know how to read data from traffic, let's encrypt it using TLS. The first step is to create a private key and certificate using OpenSSL.
          </p>
          <Code>{code12}</Code>
          <p>
            The generated key and certificate are simply base64-encoded binary data, so we could simply parse it manually after reading a spec. Instead, we'll use OpenSSL itself to parse it.
          </p>
          <Code className="code-top">openssl rsa -in ./nginx/certs/nginx.key -text -noout</Code>
          <pre className="box-bottom">
            {output5}
          </pre>
          <p>
            From the Alice's point of view, the important numbers are the modulus and the public exponent because she can use these to encrypt her data. These two numbers, along with the signature, are embedded in the certificate. Subsequently, Bob transmits this certificate to Alice through the insecure channel.
          </p>
          <p>
            Now, let's instruct Nginx to use this key and certificate.
          </p>
          <Code>{code13}</Code>
          <p>
            By setting <span class="code-block">ssl_ciphers</span> to <span class="code-block">RSA+SSH</span>, we're asking Nginx to use RSA as the asymmetric key and SHA (256 or otherwise) as the signature algorithm. The choice of symmetric key is left to Nginx/OpenSSL, and in my case, AES-256 CBC was used. We'll get to see the full cipher suite soon in our sniffed traffic.
          </p>
          <p>
            For now, let's restart our server to enable HTTPS and start capturing traffic.
          </p>
          <Code>{code14}</Code>
          <p>
            In a separate shell, let's <span class="code-block">curl</span> the server using the <span class="code-block">-k</span> flag to accept self-signed certificates.
          </p>
          <Code>{code15}</Code>
          <p>
            Back in our first shell, let's stop the capture and inspect the packets.
          </p>
          <Code className="code-top">{code16}</Code>
          <pre className="box-bottom">
            {output15}
          </pre>
          <p>
            Much like the HTTP traffic, the first three packets and the last few are the handshake and termination respectively, so we can ignore them. The remaining packets, ignoring the <span class="code-block">ACK</span>s, are:
          </p>
          <ol>
            <li>Client Hello (packet 4) from the client to the server.</li>
            <li>Server Hello et al. (packet 6) from the server to the client.</li>
            <li>Client Key Exchange et al. (packet 8) from the client to the server.</li>
            <li>Change Cipher Spec et al. (packet 10) from the server to the client.</li>
            <li>Application Data (packet 12), presumably the encrypted GET request, from the client to the server.</li>
            <li>Application Data (packet 14), presumably the encrypted response, from the server to the client.</li>
          </ol>
          <p>
            There are a lot of negotiations going on here, but in this post we'll only focus on the ones that are relevant to decrypt the traffic. In packet 4, the client lists the cipher suites it would like the server to use. In the Server Hello, the server will respond with one suite in this list that it supports. The client also passes a bunch of <span class="code-block">Extension</span>s, asking the server to, for example, "Encrypt Then MAC" and use Extended Master Secrets.
          </p>
          <Code className="code-top">{code17}</Code>
          <pre className="box-bottom">
            {output6}
          </pre>
          <p>
            However, the most important encryption-relevant information in the Client Hello is the "Client Random", a 32 byte random number that will be used to generate the Master Secret, which in turn will be used to generate the symmetric encryption key. The Client Random itself is a concatenation of the GMT time and a 28 byte cryptographically random integer (note that the last 28 bytes of Random and Random Bytes are the same).
          </p>
          <Code className="code-top">root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 4" -V | grep "Random Bytes" -B2</Code>
          <pre className="box-bottom">
            {output7}
          </pre>
          <p>
            On to packet 6, the server's response to the clients cipher suites and <span class="code-block">Extension</span>s request.
          </p>
          <Code className="code-top">root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 6" -V | grep -e "Cipher Suite:" -e "Extension:"</Code>
          <pre className="box-bottom">
            {output8}
          </pre>
          <p>
            The chosen cipher suite was TLS_RSA_WITH_AES_256_CBC_SHA, which means that AES-256 CBC was the chosen symmetric cipher. Interestingly, the server has only two <span class="code-block">Extension</span>s, effectively ignoring the client's request to "Encrypt Then MAC" and to use an Extended Master Secret (because the archaic Nginx doesn't yet support it). This is convenient because decrypting payloads without an Extended Master Secret is slightly easier.
          </p>
          <p>
            Packet 6 is also the one where the public key and modulus are sent to the client. In our case, we're going to assume that we have access to the private key (and thus the public key), but it's good to <span class="code-block">grep</span> it anyways.
          </p>
          <Code className="code-top">{code18}</Code>
          <pre className="box-bottom">
            {output9}
          </pre>
          <p>
            Finally, the server also sends a 32-byte random number, the "Server Random", which is crucial for deriving the symmetric cipher key.
          </p>
          <Code className="code-top">root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 6" -V | grep "Random Bytes" -B2</Code>
          <pre className="box-bottom">
            {output10}
          </pre>
          <p>
            Here's a brief summary of what's happened so far. The client and server have negotiated the cipher suites and exchanged 32-byte random numbers. Additionally, the server has sent an RSA public key to the client. The client will now:
          </p>
          <ol>
            <li>Generate a 48-byte "Pre Master Secret".</li>
            <li>Encrypt this Pre Master Secret using the server's public key.</li>
            <li>Send this encrypted Pre Master Secret to the server.</li>
          </ol>
          <p>
            Both the client and the server will then:
          </p>
          <ol>
            <li>Decrypt the encrypted Pre Master Secret.</li>
            <li>Generate symmetric cipher keys (one each for the client and the server) using the Pre Master Secret, Client Random, and Server Random.</li>
            <li>Encrypt all subsequent traffic using these derived symmetric keys.</li>
          </ol>
          <p>
            Packet 8 contains this encrypted Master Secret.
          </p>
          <Code className="code-top">root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 8" -V | grep "RSA Encrypted PreMaster Secret" -A2</Code>
          <pre className="box-bottom">
            {output11}
          </pre>
          <p>
            Unfortunately, tshark truncates its output. Fortunately, we can conjure up some formatting wizardry to retrieve the whole output.
          </p>
          <Code className="code-top">root@3bdb5bc5fa48:$ tshark -r eth0.pcap -Y "frame.number == 8" -T fields -e "tls.handshake.epms"</Code>
          <pre className="box-bottom">
            {output12}
          </pre>
          <p className="space warning-box">
            Finding the correct field name can be tricky. What I normally do is print the output in the <span class="code-block">jsonraw</span> format and then <span class="code-block">grep</span> the value I'm looking for to find the JSON key. Discarding the "_raw" from the end of the key (changing, for example, <span class="code-block">tls.handshake.epms_raw</span> to <span class="code-block">tls.handshake.epms</span>) usually gives me valid fields.
          </p>
          <p>
            Packet 10 is important, but not relevant. Packets 12 and 14 are the encrypted payload to and from the server respectively, so we're definitely going to need that. You can pass these payloads through <span class="code-block">xxd -r -p</span> to verify that they are, indeed, encrypted.
          </p>
          <Code className="code-top">{code19}</Code>
          <pre className="box-bottom">
            {output13}
          </pre>
          <Code className="code-top">{code20}</Code>
          <pre className="box-bottom">
            {output14}
          </pre>
        </section>
        <section>
          <h1 className="big-space">Section 3: Decryption</h1>
          <p>
            We now have sufficient information to decrypt the payload in packets 12 and 14. Everything that's coming up is defined in detail in <a href="https://datatracker.ietf.org/doc/html/rfc5246">RFC 5246</a>, so feel free to look it up for further details.
          </p>
          <p>
            Recall that the client first generated a Pre Master Secret, encrypted it using the public key, and sent it to the server. We've intercepted this encrypted Pre Master Secret and we assume that we've got the private key, so we can decrypt it.  Note: The following code uses the <span className="code-block">pycryptodome</span> library, Python 3+, and assumes that the private key is in the current directory.
          </p>
          <Code>{code21}</Code>
          <p>
            There's no magic going on here: It's just plain ol' RSA with some padding. We can verify this by doing the math manually.
          </p>
          <Code>{code22}</Code>
          <p>
            Now that we have the decrypted Pre Master Secret, the next step is to generate a Master Secret from it. To do this, RFC 5246 specifies a Pseudo-Random Function (PRF) that's essentially a recursive application of HMAC keyed by the Pre Master Secret on the concatentation of the bytearray "master secret", Client Random, and Server Random.
          </p>
          <Code>{code23}</Code>
          <p>
            Having obtained the Master Secret, we can use it to generate keying material using the very same PRF we used previously.  It's worth noting that this time, the byte array used is "key expansion", and that the Server Random precedes the Client Random.
          </p>
          <Code>{code24}</Code>
          <p>
            The first 40 bytes are for the MAC, so we don't need it right now. Of the next 64 bytes, the first 32 are used for the client's key (we're using AES-CBC, so we need 256 bits of key) while the next 32 are used for the server's key. Equipped with the keys, we can write a function to decrypt data, unpad it, and remove the MAC (recall that the client's request for "Encrypt Then MAC" was rejected by the server in the Server Hello, so MAC then encrypt was used).
          </p>
          <Code>{code25}</Code>
          <p>
            There you have it! TLS traffic successfully decrypted! It's true that we employed an outdated version of Nginx that doesn't support Extended Master Secrets and is thus vulnerable to MITM attacks as mentioned in the <a href="https://www.ietf.org/rfc/rfc7627.html">RFC</a>. Nevertheless, I trust that I've captured the fundamental process of how TLS encrypts and decrypts packets.
          </p>
        </section>
        <p>&nbsp;</p>
      </article>
    );
  }
}
