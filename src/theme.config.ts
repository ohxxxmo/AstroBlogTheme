export const THEME_CONFIG: App.Locals["config"] = {
  /** blog title */
  title: "知行合一",
  /** your name */
  author: "Just for fun",
  /** website description */
  desc: "Rediscory the beauty of typography",
  /** your deployed domain */
  website: "https://astro-theme-typography.vercel.app/",
  /** your locale */
  locale: "zh-cn",
  /** theme style */
  // themeStyle: "light",
  // 'light' | 'dark'
  themeStyle: "dart",
  /** your socials */
  socials: [],
  /** your header info */
  header: {},
  /** your navigation links */
  navs: [
    // {
    //   name: "文章",
    //   href: "/posts/page/1",
    // },
    // {
    //   name: "归档",
    //   href: "/archive",
    // },
    // {
    //   name: "标签",
    //   href: "/categories",
    // },
    // {
    //   name: "关于",
    //   href: "/about",
    // },
    {
      name: "Posts",
      href: "/posts/page/1",
    },
    {
      name: "Archive",
      href: "/archive",
    },
    {
      name: "Categories",
      href: "/categories",
    },
    {
      name: "About",
      href: "/about",
    },
  ],
  /** your category name mapping, which the `path` will be shown in the url */
  category_map: [],
  /** your comment provider */
  comments: {
    disqus: {
      shortname: "typography-astro",
    },
    // giscus: {
    //   repo: 'moeyua/astro-theme-typography',
    //   repoId: 'R_kgDOKy9HOQ',
    //   category: 'General',
    //   categoryId: 'DIC_kwDOKy9HOc4CegmW',
    //   mapping: 'title',
    //   strict: '0',
    //   reactionsEnabled: '1',
    //   emitMetadata: '1',
    //   inputPosition: 'top',
    //   theme: 'light',
    //   lang: 'zh-CN',
    //   loading: 'lazy',
    // },
    // twikoo: {
    //   envId: "https://twikoo-tau-flame.vercel.app",
    // }
  },
};
