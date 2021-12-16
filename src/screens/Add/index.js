import { useRef, useState } from 'react';
import DragDrop from '../../components/add/DragDrop';
import Button from '../../components/auth/Button';
import { useForm } from 'react-hook-form';
import { getLocationData } from '../../utils';
import {
  Background,
  BaseBox,
  CancelButton,
  FindLocation,
  Input,
  InputContainer,
  InputItem,
  InputLabel,
  TextArea,
  Title,
  Wrapper,
} from './styles';
import { gql, useMutation } from '@apollo/client';

const CREATE_COFFEESHOP_MUTATION = gql`
  mutation createCoffeeShop(
    $name: String!
    $address: String!
    $latitude: String!
    $longitude: String!
    $photoFiles: [Upload]!
    $caption: String!
  ) {
    createCoffeeShop(
      name: $name
      address: $address
      latitude: $latitude
      longitude: $longitude
      caption: $caption
      photoFiles: $photoFiles
    ) {
      ok
      error
      coffeeShop {
        id
      }
    }
  }
`;

function Add() {
  const [address, setAddress] = useState(''); // 주소
  const [isOpenPost, setIsOpenPost] = useState(false);
  const latitude = useRef(0);
  const longitude = useRef(0);
  const [photoFiles, setPhotoFiles] = useState([]);

  const onChangeOpenPost = () => {
    setIsOpenPost(!isOpenPost);
  };

  const onCompletePost = async (data) => {
    let fullAddr = data.address;
    let extraAddr = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddr +=
          extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }

    setAddress(fullAddr);
    setIsOpenPost(false);

    const result = await getLocationData(fullAddr);
    latitude.current = result.documents[0].x;
    // console.log(result.documents[0].x); // 위도
    longitude.current = result.documents[0].y;
    // console.log(result.documents[0].y); // 경도
  };

  const { register, getValues, handleSubmit } = useForm({
    mode: 'onChange',
  });

  const onCompleted = (data) => {
    console.log({ data });
    // const {
    //   createCoffeeShop: { ok, error, coffeeShop },
    // } = data;
    // if (!ok) {
    //   console.log({ error });
    //   return setError('result', {
    //     message: error,
    //   });
    // }

    // if (token) {
    //   logUserIn(token);
    // }
  };

  const [createCoffeeShop, { loading }] = useMutation(
    CREATE_COFFEESHOP_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { name, caption } = getValues();

    createCoffeeShop({
      variables: {
        name,
        caption,
        address,
        latitude: latitude.current,
        longitude: longitude.current,
        photoFiles: photoFiles.map((photoFile) => photoFile.object),
      },
    });
  };

  return (
    <Background>
      <Wrapper>
        <BaseBox>
          <Title>Upload JakCa</Title>

          <DragDrop files={photoFiles} setFiles={setPhotoFiles} />
          <InputContainer onSubmit={handleSubmit(onSubmitValid)}>
            <InputItem>
              <InputLabel>Name of JakCa</InputLabel>
              <Input
                {...register('name', {
                  required: 'Name of JakCa is required.',
                })}
              />
            </InputItem>

            {address ? (
              <>
                <InputItem>
                  <InputLabel>Address</InputLabel>
                  <Input
                    {...register('address')}
                    value={address}
                    onClick={onChangeOpenPost}
                    readOnly
                  />
                </InputItem>
              </>
            ) : (
              <InputItem>
                <InputLabel>Location</InputLabel>
                <Input onFocus={onChangeOpenPost} />
              </InputItem>
            )}

            <InputItem>
              <InputLabel>Caption</InputLabel>
              <TextArea {...register('caption')} />
            </InputItem>
            <Button value={'Upload'} type='submit' />
            <CancelButton>Cancel</CancelButton>
          </InputContainer>
        </BaseBox>
        {isOpenPost && <FindLocation autoClose onComplete={onCompletePost} />}
      </Wrapper>
    </Background>
  );
}
export default Add;
