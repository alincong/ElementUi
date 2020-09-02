// 需要用到element-ui中组件
import Vue from "vue"
//Message：导入弹框提示组件
import {
  Button,Form,FormItem,Input,Message,Container,Heade,Aside,Main,Menu,Submenu,MenuItem,
  Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Pagination,Dialog,
  MessageBox,Tag,Tree,Cascader,Alert,Tabs,TabPane,Steps,Step,CheckboxGroup,Checkbox
} from "element-ui"

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Heade);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;