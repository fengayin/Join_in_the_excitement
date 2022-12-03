<script>
import { mapMutations } from "vuex";
import { getToken } from "./api/getToken";
export default {
  onLaunch: function () {
    console.log("App Launch");
    this.login();
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    ...mapMutations(["isLoginBtn"]),
    login() {
      uni.getStorage({
        key: "uerInfo",
        success: (res) => {
          this.noLogin(res.data);
        },
        fail: (err) => {
          let that = this;
          uni.showModal({
            title: "提示",
            content: "请问是否确定登录",
            success: function (res) {
              if (res.confirm) {
                //这里是点击了确定以后
                let userList = {
                  username: "用户A001",
                  userPicSrc: "../../static/icon/pic.png",
                  token: undefined,
                };
                that.noLogin(userList);
              } else {
                //这里是点击了取消以后
                console.log("用户点击取消");
              }
            },
          });
        },
      });
    },
    async getToken(code, newuserList) {
      try {
        let userList = newuserList;
        let token = await getToken(code);
        console.log(code);
        userList.token = token;
        console.log("userList", userList);
        this.isLoginBtn(userList);
      } catch (e) {
        console.log(e);
      }
    },

    noLogin(userList) {
      // 调用登录api
      uni.login({
        provider: "weixin",
        success: (res) => {
          let code = res.code;
          if (res.errMsg == "login:ok") {
            //TODO 获取code 携带code参数调用后端接口
            // getOpenid
            this.getToken(code, userList);
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style>
/*每个页面公共css */
@import "./styles/base.wxss";
@import "./styles/iconfont.wxss";
</style>
