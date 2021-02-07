import Vue from 'vue';
import { Button, Form, Input, FormItem, Message, Dropdown, DropdownItem, DropdownMenu } from 'element-ui';

Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);

Vue.prototype.$message = Message;