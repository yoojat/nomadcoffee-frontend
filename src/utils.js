export const getLocationData = (address) => {
  //   curl -v -X GET "https://dapi.kakao.com/v2/local/search/address.json" \
  // -H "Authorization: KakaoAK f65a5b7b98f3d0e068afa0c18dad99a3" \
  // --data-urlencode "query=전북 삼성동 100"
  return fetch('https://dapi.kakao.com/v2/local/search/address.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
    },
    body: `query=${address}`,
  }).then((response) => response.json());
};
