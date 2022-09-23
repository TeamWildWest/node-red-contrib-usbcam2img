module.exports.code = (config) => {
  return String.raw`
        <!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.socket.io/4.5.0/socket.io.min.js" integrity="sha384-7EyYLQZgWBi67fBtVxw60/OWl1kjsfrPFcaU0pp0nAh+i8FD068QogUvg85Ewy1k" crossorigin="anonymous"></script>
            <title>UsbCamera Stream to Img frame</title>
        </head>
        
        <body>
          <div align="center" style="min-height: 800px;">
            <h1>Usbcamera to Img Page</h1>
            <div style="display: inline-block;" align="center" class="tooltip">
              <video id="video" style="border:3px solid grey">Video stream not available.</video>
              <!-- <canvas id="canvas" style="border:3px solid grey"></canvas><br> -->
            </div>
          </div>
          <div>
            <button id="startBtn">Start capturing</button>
            <button id="captureBtn">capture One Frame</button>
          </div>
        </body>
        
        </html>
        
        <script type="module">
            window.onload = function() {
              document.getElementById("startBtn").addEventListener("click", handleStart);
              document.getElementById("captureBtn").addEventListener("click", () => {
                let data = getImgURL("image/${config.fileformat}");
                const a = document.createElement("a");
                a.href = data;
                a.download = "capture.${config.fileformat}";
                a.click();
              });
            }

            let width = 1280;
            let height = 720;
            let streaming = false;
            const video = document.getElementById("video");
            // const canvas = document.getElementById("canvas")
            const canvas = document.createElement("canvas");

            const dataWebSocket = new WebSocket("${config.dataWsURL}")
            const constraints = {
              audio: false,
              video: {
                width: {
                  min: 1024,
                  ideal: 1280,
                  max: 1920
                },
                height: {
                  min: 776,
                  ideal: 720,
                  max: 1080
                }
              }
            }
            
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
              video.srcObject = stream;
              video.play();
            })
            .catch((err) => {
              console.error("An error occurred");
            });

            video.addEventListener('canplay', (ev) => {
              if (!streaming) {
                height = video.videoHeight / video.videoWidth * width;
        
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
              }
            }, false);

            function getImgURL(fileformat) {
              const context = canvas.getContext('2d');
              if (width && height) {
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);
                const data = canvas.toDataURL(fileformat);

                return data;
              }
            }
  
            function handleStart() {
              let dataURL;
              let cnt = 1;
              let delay = 1000 / ${config.fps};

              let takePicture = setTimeout(run, delay);

              function run() {
                dataURL = getImgURL("image/${config.fileformat}");
                dataWebSocket.send(dataURL);
                takePicture = setTimeout(run, delay);

                if(cnt > ${config.totalFrame} * 1.2) {
                  clearTimeout(takePicture);
                }
                console.log(cnt++);
              }
            }
  
            function handleStop() {
                clearInterval(sendFrameInterval);
                alert("STOP Capturing");
            }
            
        </script>
        `;
};
