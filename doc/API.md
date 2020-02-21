## 1. 取前端样式    
### 1.1 取路由   
kind: VUE_APP_PROJECTNUM + '-viewroute'    

**请求路径:** GET /frontend/query

**参数描述:** 

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| kind | java.lang.String | true | 类型是字符串类型，长度是2到20位，只允许大小写，请执行kubectl api-resources查看执行的类型 | Pod |     

### 1.2 取资源表头   
* Node   
* Pod/StatefulSet/ReplicationController/ReplicaSet/Deployment/Job/CronJob/DaemonSet
* VirtualMachine/VirtualMachineDisk/VirtualMachineImage/VirtualMachineNetwork/VirtualMachinePool     

**请求路径:** GET /frontend/query   

### 1.3 获取资源全部类别(tabName)  
kind: container/virtualmachine   
operator: Catalog   

**请求路径:** GET /template/query

**参数描述:** 

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| kind | java.lang.String | true | 类型是字符串类型，长度是2到20位，只允许大小写，请执行kubectl api-resources查看执行的类型 | Pod |
| operator | java.lang.String | true | 操作是字符串类型，长度是2到20位，只允许大小写 | Get |  

### 1.4 获取资源操作   
kind: all rs  
operator: Action  

**请求路径:** GET /template/query

### 1.5 获取sdk链接和版本   
kind: container/virtualmachine  
operator: api  

**请求路径:** GET /template/query    

## 2 模板资源操作
### 2.1 资源种类 
* Pod/StatefulSet/ReplicationController/ReplicaSet/Deployment/Job/CronJob/DaemonSet
* VirtualMachine/VirtualMachineDisk/VirtualMachineImage/VirtualMachineNetwork/VirtualMachinePool

### 2.2 调用接口  
获取资源运行状态和结果   

**请求路径:** POST /lifecycle/get

**参数描述:** 

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| kind | java.lang.String | true | 类型是字符串类型，长度是2到20位，只允许大小写，请执行kubectl api-resources查看执行的类型 | Pod |
| name | java.lang.String | false | 用户名是字符串类型，长度是4到100位，只允许数字、大小写字母、中划线、以及圆点 | test |
| namespace | java.lang.String | false | 命名空间是字符串类型，长度是1到50位，只允许数字、大小写字母、中划线、以及圆点 | test |
| operator | java.lang.String | true | 操作是字符串类型，长度是2到20位，只允许大小写 | Get |
| labels | java.util.Map | false | 对象不能为空 | java.util.Map |   

* 更新资源
**请求路径:** POST /lifecycle/update

**参数描述:** 

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| kind | java.lang.String | true | 类型是字符串类型，长度是2到20位，只允许大小写，请执行kubectl api-resources查看执行的类型 | Pod |
| json | java.lang.Object | true | 对象不能为空 | 任何对象 |     

删除资源  
**请求路径:** POST /lifecycle/delete

**参数描述:** 

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| kind | java.lang.String | true | 类型是字符串类型，长度是2到20位，只允许大小写，请执行kubectl api-resources查看执行的类型 | Pod |
| json | java.lang.Object | true | 对象不能为空 | 任何对象 |   

创建资源  
**请求路径:** POST /lifecycle/create

**参数描述:** 

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| kind | java.lang.String | true | 类型是字符串类型，长度是2到20位，只允许大小写，请执行kubectl api-resources查看执行的类型 | Pod |
| json | java.lang.Object | true | 对象不能为空 | {"a": "b"} |


