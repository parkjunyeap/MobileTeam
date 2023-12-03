import { useState, useEffect } from "react";
import axios from "axios"; // 데이터 웹브라우저에서 페이지 받아오는역할

const useFetch = (endpoint, query) => {
  // 언제든지 재사용하기위해서 엔드포인트 , 쿼리 있어야함.
  const [data, setData] = useState([]); // 데이터갖고오기위한 상태변수  // 배열로 json 관리할 수 있으려나
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: "POST",
    url: ` 10.20.64.10:3000${endpoint}`,

    params: { ...query },
  };
  //요청 메서드, URL, 요청 헤더, 쿼리 매개변수

  const fetchData = async () => {
    setIsloading(true); // 로딩

    try {
      const response = await axios.request(options); // 요청 옵션스 정보로
      setData(response.data.data); // 데이터 갖고오ㅗ고
      //   setIsloading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsloading(false); // 결국 로딩 다됐다.
    }
  };

  useEffect(() => {
    fetchData(); // 이메소드 한번 실행했을때 최초 한번만
  }, []); //한번만 실행.

  const refetch = () => {
    fetchData();
  };
  return { data, isLoading, error, refetch }; // 데이터 받아오고싶을때 endpoint 대신 전체 url
};
export default useFetch;

// 여길 잘하면될것같음.
