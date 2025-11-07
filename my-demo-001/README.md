# Agent Demo Backend (AI-2025)

一个基于 Spring Boot 的示例后端项目，展示“agent”风格分层结构与基础 CRUD 操作。项目使用 H2 内存数据库，启动后即可通过 REST 接口进行代理(Agent)实体的创建、查询、更新、删除。

## 目录结构

```
pom.xml
src/
	main/
		java/com/example/agent/
			AgentDemoApplication.java        # 启动类
			domain/Agent.java                # 领域实体
			repository/AgentRepository.java  # 资源库接口 (数据访问)
			service/AgentService.java        # 领域/应用服务 (业务逻辑)
			web/AgentController.java         # Web 层 (REST API)
		resources/
			application.properties           # 配置 (H2 / JPA / 日志)
	test/
		java/com/example/agent/web/AgentControllerTest.java # CRUD 测试
```

分层说明：
* domain: 领域模型与实体
* repository: 领域对象的持久化抽象（Spring Data JPA）
* service: 业务逻辑与领域操作封装
* web: 控制器，暴露 REST 接口

## 运行环境
* JDK 8+ (当前使用 Spring Boot 2.7.18，可兼容 8；推荐升级到 JDK 17 以便未来迁移到 Boot 3.x)
* Maven 3.6+

## 快速启动

```powershell
mvn spring-boot:run
```

启动后访问：
* H2 控制台: http://localhost:8080/h2-console  (JDBC URL: `jdbc:h2:mem:agentdb`)
* REST 基础路径: http://localhost:8080/agents

## REST API 示例

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /agents        | 创建 Agent |
| GET  | /agents        | 列出所有 Agents |
| GET  | /agents/{id}   | 根据 ID 查询 |
| PUT  | /agents/{id}   | 更新 |
| DELETE | /agents/{id} | 删除 |

### 创建
```http
POST /agents
Content-Type: application/json

{
	"name": "Alice",
	"role": "OPERATOR",
	"status": "ACTIVE"
}
```

响应 (201):
```json
{
	"id": 1,
	"name": "Alice",
	"role": "OPERATOR",
	"status": "ACTIVE",
	"createdAt": "2025-11-08T00:00:00Z",
	"updatedAt": "2025-11-08T00:00:00Z"
}
```

### 更新
```http
PUT /agents/1
Content-Type: application/json

{
	"id": 1,
	"name": "Alice Updated",
	"role": "OPERATOR",
	"status": "ACTIVE"
}
```

### 删除
```http
DELETE /agents/1
```

## 运行测试
```powershell
mvn test
```

## 后续可扩展建议
* 增加 DTO 与 MapStruct 做对象转换，避免直接暴露实体
* 增加全局异常处理与统一响应结构
* 增加分页、排序、过滤查询能力
* 集成 OpenAPI (springdoc) 生成接口文档
* 增加安全（Spring Security + JWT）

## License
示例代码可自由复制修改用于学习与内部演示。
