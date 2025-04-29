import { UserProvider } from "@/context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <div>
        <h1>App is loading</h1>
      </div>
    </UserProvider>
  );
};

export default App;
