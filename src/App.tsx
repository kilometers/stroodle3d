import LoadImage from './Components/LoadImage'
import MeshSettings from './Components/MeshSettings'
import './App.css'
import { useImgStore } from './stores/imgStore'
import React from 'react'
import { useCvStore } from './stores/cvStore'
import cv from '@techstark/opencv-js'
import ThreeView from './Components/ThreeView'
import '@react-three/fiber'
import ExportSTL from './Components/ExportSTL'
import ThreeViewOptions from './Components/ThreeViewOptions'
import { Typography } from '@mui/material'

function App() {
  const img = useImgStore((state) => state.img)
  const {threshold, setContours, smoothing } = useCvStore()
  // const thresholdImgRef = React.useRef<HTMLCanvasElement>(null)
  const contourImgRef = React.useRef<HTMLCanvasElement>(null)
  const imgRef = React.useRef<HTMLImageElement>(null)

  const processContours = () => {
    if (img && contourImgRef.current && imgRef.current && imgRef.current.width > 0 && imgRef.current.height > 0) {
      let src = cv.imread("img");
      let threshDst = new cv.Mat();
      let contourDst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4);
      let contoursVector = new cv.MatVector();
      let cleanContoursVector = new cv.MatVector();
      let hierarchy = new cv.Mat();
  
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
      cv.threshold(src, threshDst, threshold, 255, cv.THRESH_BINARY);
      cv.findContours(threshDst, contoursVector, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
      
      // remove small contours or contours that touch the border
      for (let i = 0; i < contoursVector.size(); i++) {
        let contour = contoursVector.get(i);
        let touchesBorder = false;
        if(contour.size().height < 3) {
          continue;
        }
        for(let j = 0; j < contour.size().height; j++) {
          const border = 5;
          if(contour.data32S[j * 2] < border || contour.data32S[j * 2 + 1] < border || contour.data32S[j * 2] > src.cols - border - 1 || contour.data32S[j * 2 + 1] > src.rows - border - 1) {
            touchesBorder = true;
            break;
          }
        }
        if(!touchesBorder) {
          let smoothedContour = new cv.Mat();
          const epsilon = smoothing * cv.arcLength(contour, true);
          cv.approxPolyDP(contour, smoothedContour, epsilon, true);
          cleanContoursVector.push_back(smoothedContour);
        }
      }
      cv.drawContours(contourDst, cleanContoursVector, -1, new cv.Scalar(255, 0, 255, 255), 1);
  
      // cv.imshow(thresholdImgRef.current, threshDst);
      cv.imshow(contourImgRef.current, contourDst);
  
      setContours(cleanContoursVector);
      
      src.delete();
      threshDst.delete();
      contourDst.delete();
      contoursVector.delete();
      hierarchy.delete();
    }
  }

  React.useEffect(() => {
    processContours();
  }, [img, threshold, smoothing, imgRef.current]); 

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <div style={{
          padding: 10,
          margin: 10,
          borderRadius: 10,
          borderColor: 'lightgrey',
          borderWidth: 1,
          borderStyle: 'solid'
        }}>
          <LoadImage />
          <div style={{ width: 250, position: 'absolute' }}>
            <img 
              ref={imgRef} 
              id="img" 
              src={img} 
              style={{ width: '100%', height: '100%', opacity: 0.3 }} 
              onLoad={processContours} />
          </div>
          <div style={{ position: 'absolute' }}>

          <canvas ref={contourImgRef}/>
            </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 10,
          margin: 10,
          borderRadius: 10,
          borderColor: 'lightgrey',
          borderWidth: 1,
          borderStyle: 'solid'
        }}>
          <div style={{
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <ThreeView />
            <ThreeViewOptions/>
          </div>
          <MeshSettings />
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'end'
        }}>
          <span style={{
            fontFamily: "'Playwrite PE', cursive",
            fontSize: 30
          }}><b>stroodle</b></span>
          <span style={{ width: 10, margin: 10 }}></span>
          <span style={{ margin: 2 }}><Typography><i>a doodle extruder</i></Typography></span>
          <span style={{ width: 10, margin: 10 }}></span>
          <span style={{ margin: 2 }}><Typography><i>© 2024 M. Baird</i></Typography></span>
        </div>
        <ExportSTL />
      </div>
    </>
  )
}

export default App
