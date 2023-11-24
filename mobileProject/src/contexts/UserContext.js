import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// const UserContext = createContext({}); // 원래이코드 지피티가 이거 말고 밑에거로 바꿔보라해서
const UserContext = createContext([{}, () => {}]);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useUserState = () => useContext(UserContext);

export { useUserState, UserProvider };
