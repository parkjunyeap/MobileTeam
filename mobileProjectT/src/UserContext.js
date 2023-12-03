import { createContext, useState } from "react";

// 새로운 컨텍스트 객체를 생성. 이 UserType객체를 통해 userId와 setUserId를 공유할 수 있음.
const UserType = createContext();

// UserContext 컴포넌트는 UserType.Provider를 사용하여 userId와 setUserId를
// 자식 컴포넌트에게 전달하는 데 사용됨.
const UserContext = ({ children }) => {
  // userId 상태와 이를 설정하는 함수 setUserId를 useState 훅을 통해 생성.
  const [userId, setUserId] = useState("");

  // UserType.Provider를 사용하여 userId와 setUserId를 value로 제공함으로써
  // 이 컨텍스트를 사용하는 모든 자식 컴포넌트에서 이 값을 사용하거나 업데이트할 수 있음.
  return (
    <UserType.Provider value={{ userId, setUserId }}>
      {children}
    </UserType.Provider>
  );
};

// UserType과 UserContext를 다른 파일에서 사용할 수 있도록 내보냄.
export { UserType, UserContext };

// userId
