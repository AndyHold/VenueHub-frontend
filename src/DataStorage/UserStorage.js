const UserStorage = {
  data: {
    userId: null,
    username: null,
    email: null,
    givenName: null,
    familyName: null
  },
  methods: {
    setUserData(user, userId) {
      UserStorage.data.userId = userId;
      UserStorage.data.username = user.username;
      UserStorage.data.email = user.email;
      UserStorage.data.givenName = user.givenName;
      UserStorage.data.familyName = user.familyName;
    },
    isLoggedIn() {
      return UserStorage.data.userId;
    },
    logout() {
      UserStorage.data.userId = null;
      UserStorage.data.username = null;
      UserStorage.data.email = null;
      UserStorage.data.givenName = null;
      UserStorage.data.familyName = null;
    }
  }
};

export default UserStorage;
