# Motion Detect JS

## Motivation
I bought a IP camera (TP-Link Tapo C200) and I would like to get notification when it detect any motion.  
But it did not support automation, I only can keep my eyes on Tapo app to aware the motion change.  
Therefore, I make a function to do that.  

## Introduction
This function include 2 handler  

### rtsp_handler.js
This file will grab single frame from RTSP stream.  
It use FFmpeg to do.  

### img_handler.js
This file will receive 2 images and detect the difference.  
It use OpenCV to do.  

### index.js
This is the entry.  

## Get started
Download [opencv.js](https://docs.opencv.org/4.5.2/opencv.js) file (I used version 4.5.2) and put it to this folder  
Run `npm install`  
Provide the `base.jpg` to this folder, It will be treated as the first image, the second image will be compared to the first and find the difference  

## Usage
Just enter the following command  
```bash
npm start -- --url "<your_url>"
```

You also can create `.env` file, put `URL` variable to there and run `npm start`.  
In the case you're using C200 camera, the URL should be `rtsp://<usr>:<pwd>@<ip>:554/stream1`.  

## What's next
I'm going to import this function to [Node-RED](https://nodered.org/).  
