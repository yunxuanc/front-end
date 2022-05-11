<template>
  <div>
    <a-form-item label="状态">
      <a-input
        v-decorator="[
          'aaa',
          {
            rules: [
              { validator: aaaValidator },
              { required: true, message: '请输入' },
            ],
          },
        ]"
        style="width: 100%"
        type="select"
        @change="(e) => {this.handleChange('aaa', e?.target?.value)}"
      />
    </a-form-item>
    <a-form-item label="开始时间">
      <a-date-picker
        v-decorator="[
          'bbb_time',
          {
            rules: [
              { validator: bbbValidator },
              { required: true, message: '请选择' },
            ],
          },
        ]"
        @change="(value, dateString) => {this.handleChange('bbb_time', value)}"
      />
    </a-form-item>
    <a-form-item label="结束时间">
      <a-date-picker
        v-decorator="[
          'ccc_time',
          {
            rules: [
              { validator: cccValidator },
              { required: true, message: '请选择' },
            ],
          },
        ]"
        @change="(value, dateString) => {this.handleChange('bbb_time', value)}"
      />
    </a-form-item>
  </div>
</template>
<script>
export default {
  data() {
    return {
      valueType: '',
      form: this.$form.createForm(this, { name: 'form' }),
    }
  },
  methods: {
    handleChange(key, value) {
      // 标记当前操作的表单元素，用于关联校验aaa bbb ccc
      this.valueType = key;
      // 格式化选择日期
      if (key.indexOf('time') > -1) {
        value = value.format('YYYY-MM-DD HH:mm:ss');
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          [key]: value,
        });
        // aaa bbb ccc 在change时无法触发校验的解决
        this.form.validateFields([key]);
      });
    },
    // aaa状态影响bbb_time ccc_time范围
    aaaValidator(rule, value, cb) {
      if (this.valueType === rule.field) {
        this.form.validateFields(['bbb_time', 'ccc_time'], { force: true });
      }
      cb();
    },
    bbbValidator(rule, value, cb) {
      // ...
      // bbb_time 改变要触发 ccc_time的关联校验
      if (this.valueType === rule.field) {
        this.form.validateFields(['ccc_time'], { force: true });
      }
      cb();
    },
    cccValidator(rule, value, cb) {
      // ...
      // ccc_time 改变要触发 bbb_time的关联校验
      if (this.valueType === rule.field) {
        this.form.validateFields(['bbb_time'], { force: true });
      }
      cb();
    },
  }
}
</script>
<style scoped>

</style>
