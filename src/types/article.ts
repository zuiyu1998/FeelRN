/** 文章作者 */
interface ArticleAuthor {
  id: string
  nickname: string
  avatar?: string
}

/** 文章元信息 */
interface ArticleMeta {
  title: string
  summary?: string
  author: ArticleAuthor
  publishedAt: string // ISO 8601
  updatedAt?: string // ISO 8601
}

/** 内嵌媒体 */
interface ArticleMedia {
  type: 'image' | 'video' | 'audio'
  url: string
  width?: number
  height?: number
  duration?: number // 音视频时长（秒）
}

/** 文章正文 */
interface ArticleContent {
  /** 正文原始文本或 Markdown */
  body: string
  /** 封面图 URL */
  coverImage?: string
  /** 正文中的媒体资源（图片、视频等） */
  media?: ArticleMedia[]
}

/** 标签 / 分类 */
interface ArticleTag {
  id: string
  name: string
}

/** 互动统计数据 */
interface ArticleStats {
  viewCount: number
  likeCount: number
  rebuttalCount: number // 反驳数
  commentCount: number
  shareCount: number
  favoriteCount: number
}

/** 当前用户的互动状态 */
interface ArticleInteraction {
  isLiked: boolean // 当前用户是否已点赞
  isRebuttaled: boolean // 当前用户是否已反驳
  isFavorited: boolean // 当前用户是否已收藏
}

/** 反驳数据 */
interface ArticleRebuttal {
  id: string
  author: ArticleAuthor
  content: string
  createdAt: string // ISO 8601
  likeCount: number
  replyCount: number
}

/** 完整文章 */
interface Article {
  id: string
  meta: ArticleMeta
  content: ArticleContent
  tags: ArticleTag[]
  categories: ArticleTag[]
  stats: ArticleStats
  interaction: ArticleInteraction
  rebuttals?: ArticleRebuttal[] // 反驳列表，分页加载时可能为空
}

export type {
  Article,
  ArticleAuthor,
  ArticleMeta,
  ArticleContent,
  ArticleMedia,
  ArticleTag,
  ArticleStats,
  ArticleInteraction,
  ArticleRebuttal,
}
