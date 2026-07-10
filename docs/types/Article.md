# Article

`Article` 表示一篇文章的全部内容及相关互动数据，包括文章正文、点赞、反驳等。

## 架构

```
Article
├── id                     // 文章唯一标识
├── meta                   // 元信息（标题、摘要、作者、发布时间等）
├── content                // 正文内容（支持富文本 / Markdown）
├── tags & categories      // 标签与分类
├── stats                  // 统计数据（浏览量、点赞数、反驳数等）
└── interaction            // 当前用户的互动状态（是否点赞、是否反驳等）
```

## 类型定义

```tsx
/** 文章作者 */
interface ArticleAuthor {
  id: string;
  nickname: string;
  avatar?: string;
}

/** 文章元信息 */
interface ArticleMeta {
  title: string;
  summary?: string;
  author: ArticleAuthor;
  publishedAt: string;   // ISO 8601
  updatedAt?: string;    // ISO 8601
}

/** 文章正文 */
interface ArticleContent {
  /** 正文原始文本或 Markdown */
  body: string;
  /** 封面图 URL */
  coverImage?: string;
  /** 正文中的媒体资源（图片、视频等） */
  media?: ArticleMedia[];
}

/** 内嵌媒体 */
interface ArticleMedia {
  type: 'image' | 'video' | 'audio';
  url: string;
  width?: number;
  height?: number;
  duration?: number;     // 音视频时长（秒）
}

/** 标签 / 分类 */
interface ArticleTag {
  id: string;
  name: string;
}

/** 互动统计数据 */
interface ArticleStats {
  viewCount: number;
  likeCount: number;
  rebuttalCount: number;   // 反驳数
  commentCount: number;
  shareCount: number;
  favoriteCount: number;
}

/** 当前用户的互动状态 */
interface ArticleInteraction {
  isLiked: boolean;        // 当前用户是否已点赞
  isRebuttaled: boolean;   // 当前用户是否已反驳
  isFavorited: boolean;    // 当前用户是否已收藏
}

/** 反驳数据 */
interface ArticleRebuttal {
  id: string;
  author: ArticleAuthor;
  content: string;
  createdAt: string;       // ISO 8601
  likeCount: number;
  replyCount: number;
}

/** 完整文章 */
interface Article {
  id: string;
  meta: ArticleMeta;
  content: ArticleContent;
  tags: ArticleTag[];
  categories: ArticleTag[];
  stats: ArticleStats;
  interaction: ArticleInteraction;
  rebuttals?: ArticleRebuttal[];  // 反驳列表，分页加载时可能为空
}
```

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `meta.author` | `ArticleAuthor` | 作者信息，包含 id、nickname 和可选的 avatar |
| `meta.publishedAt` | `string` | ISO 8601 格式的发布时间 |
| `content.body` | `string` | 文章正文，支持 Markdown 或富文本 |
| `content.coverImage` | `string?` | 可选封面图 |
| `stats.likeCount` | `number` | 文章总点赞数 |
| `stats.rebuttalCount` | `number` | 文章总反驳数 |
| `interaction.isLiked` | `boolean` | 当前登录用户是否已点赞 |
| `interaction.isRebuttaled` | `boolean` | 当前登录用户是否已反驳 |
| `rebuttals` | `ArticleRebuttal[]?` | 反驳列表，用于反驳区展示 |

## 使用示例

### 获取文章列表（摘要模式）

```tsx
// API 返回 Article 列表，列表页只使用部分字段
function ArticleListItem({ article }: { article: Article }) {
  return (
    <View>
      <Text>{article.meta.title}</Text>
      <Text>{article.meta.author.nickname}</Text>
      <Text>{article.meta.publishedAt}</Text>
      <Text>👍 {article.stats.likeCount}  💬 {article.stats.rebuttalCount}</Text>
    </View>
  );
}
```

### 文章详情页

```tsx
function ArticleDetail({ article }: { article: Article }) {
  return (
    <ScrollView>
      {/* 文章内容 */}
      <Text style={styles.title}>{article.meta.title}</Text>
      <Markdown>{article.content.body}</Markdown>

      {/* 互动按钮 */}
      <View style={styles.actions}>
        <Button
          title={`点赞 (${article.stats.likeCount})`}
          color={article.interaction.isLiked ? 'blue' : 'gray'}
        />
        <Button
          title={`反驳 (${article.stats.rebuttalCount})`}
          color={article.interaction.isRebuttaled ? 'red' : 'gray'}
        />
      </View>

      {/* 反驳列表 */}
      {article.rebuttals?.map((rebuttal) => (
        <RebuttalCard key={rebuttal.id} rebuttal={rebuttal} />
      ))}
    </ScrollView>
  );
}
```

## 与 API 的关系

```
GET /articles/:id
→ {
    code: 0,
    message: "ok",
    data: Article          // 完整的文章数据
  }

GET /articles
→ {
    code: 0,
    message: "ok",
    data: Article[]        // 文章列表（rebuttals 可能为空以节省带宽）
  }
```

> API 响应结构参考 `ApiResponse<T>` 定义，`data` 字段即为 `Article` 类型。
