import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

const DragDropContainer = styled.div`
  width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -ms-flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input``;
const Label = styled.label`
  width: 300px;
  height: 300px;
  border: 2px dashed #f3f3f3;
  border-radius: 3px;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -ms-flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.12s ease-in;
  background-color: ${(props) => (props.isDragging ? 'black' : 'inherit')};
  color: ${(props) => (props.isDragging ? 'white' : 'inherit')};
`;

const UploadedFiles = styled.div`
  margin-top: 1rem;

  & > div {
    width: 300px;
    padding: 8px;
    border: 1px solid black;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
`;

const PhotoDelete = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const DragDrop = ({ files, setFiles }) => {
  // 드래그 중일때와 아닐때의 스타일을 구분하기 위한 state 변수
  const [isDragging, setIsDragging] = useState(false);

  // 각 선택했던 파일들의 고유값 id
  const fileId = useRef(0);

  // 드래그 이벤트를 감지하는 ref 참조변수 (label 태그에 들어갈 예정)
  const dragRef = useRef(null);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const onChangeFiles = useCallback(
    (e) => {
      let selectFiles = [];
      let tempFiles = files;
      // temp 변수를 이용하여 선택했던 파일들을 담습니다.

      // 드래그 했을 때와 안했을 때 가리키는 파일 배열을 다르게 해줍니다.
      if (e.type === 'drop') {
        // 드래그 앤 드롭 했을때
        selectFiles = e.dataTransfer.files;
      } else {
        // "파일 첨부" 버튼을 눌러서 이미지를 선택했을때
        selectFiles = e.target.files;
      }

      for (const file of selectFiles) {
        // 스프레드 연산자를 이용하여 기존에 있던 파일들을 복사하고, 선택했던 파일들을 append 해줍니다.
        tempFiles = [
          ...tempFiles,
          {
            id: fileId.current++, // fileId의 값을 1씩 늘려주면서 각 파일의 고유값으로 사용합니다.
            object: file, // object 객체안에 선택했던 파일들의 정보가 담겨있습니다.
          },
        ];
      }
      setFiles(tempFiles);
    },
    [setFiles, files]
  ); // 위에서 선언했던 files state 배열을 deps에 넣어줍니다

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles]
  );

  const initDragEvents = useCallback(() => {
    // 앞서 말했던 4개의 이벤트에 Listener를 등록합니다. (마운트 될때)

    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn);
      dragRef.current.addEventListener('dragleave', handleDragOut);
      dragRef.current.addEventListener('dragover', handleDragOver);
      dragRef.current.addEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback(() => {
    // 앞서 말했던 4개의 이벤트에 Listener를 삭제합니다. (언마운트 될때)

    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn);
      dragRef.current.removeEventListener('dragleave', handleDragOut);
      dragRef.current.removeEventListener('dragover', handleDragOver);
      dragRef.current.removeEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  const handleFilterFile = useCallback(
    (id) => {
      // 매개변수로 받은 id와 일치하지 않는지에 따라서 filter 해줍니다.
      setFiles(files.filter((file) => file.id !== id));
    },
    [files]
  );
  return (
    <DragDropContainer>
      <Input
        type='file'
        id='fileUpload'
        style={{ display: 'none' }} // label을 이용하여 구현하기에 없애줌
        multiple={true} // 파일 다중선택 허용
      />

      <Label
        isDragging={isDragging}
        // 드래그 중일때와 아닐때의 클래스 이름을 다르게 주어 스타일 차이

        htmlFor='fileUpload'
        ref={dragRef}
      >
        <div>
          <FontAwesomeIcon icon={faCloudUploadAlt} size='3x' />
        </div>
        <div style={{ fontSize: '12px', marginTop: '10px', fontWeight: '600' }}>
          Drop files to upload
        </div>
      </Label>

      <UploadedFiles>
        {files.length > 0 &&
          files.map((file) => {
            const {
              id,
              object: { name },
            } = file;

            return (
              <div key={id}>
                <div>{name}</div>
                <PhotoDelete onClick={() => handleFilterFile(id)}>
                  X
                </PhotoDelete>
              </div>
            );
          })}
      </UploadedFiles>
    </DragDropContainer>
  );
};

export default DragDrop;
