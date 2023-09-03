import React, { useState, useEffect } from 'react'
import styles from '../styles/imageUploader.module.css'

interface S3FileDto {
  originalFileName: string
  uploadFileName: string
  uploadFilePath: string
  uploadFileUrl: string
}

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void
  initialImages: S3FileDto[] // 추가된 부분: 초기 이미지 배열
}

const imageUploader: React.FC<ImageUploaderProps> = ({
  onImagesSelected,
  initialImages,
}) => {
  const [selectedImages, setSelectedImages] = useState<File[] | null>(null)
  const [isInit, setIsInit] = useState(true) // 초기화 상태를 관리

  useEffect(() => {
    if (initialImages.length > 0) {
      setSelectedImages(initialImages.map(() => new File([], ''))) // 초기 이미지가 있을 경우 빈 File 객체로 초기화
    }
  }, [initialImages])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInit(false) // 초기화가 완료되면 isInit 값을 false로 변경
    const files = event.target.files
    if (files && files.length > 0) {
      const fileList = Array.from(files)
      setSelectedImages(fileList)
      onImagesSelected(fileList)
    } else {
      setSelectedImages(null) // 파일 선택이 해제될 경우 null로 설정
    }
  }

  return (
    <div className="imageFileContainer">
      {/* CSS 클래스를 'addImgBtn'으로 설정합니다. */}
      <label htmlFor="imageInput" className={styles.addImgBtn}>
        + {/* '+' 버튼 */}
        <input
          id="imageInput"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }} // 실제 파일 업로드 버튼을 숨깁니다.
        />
      </label>
      <div className="imagePreviewList">
        {selectedImages
          ? selectedImages.map((image, index) => (
              <div key={index} className="ImagePreview">
                <img
                  src={
                    isInit && initialImages[index]
                      ? initialImages[index].uploadFileUrl
                      : image
                      ? URL.createObjectURL(image)
                      : ''
                  }
                  alt={`Image ${index}`}
                  className={styles.imageFile}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default imageUploader
