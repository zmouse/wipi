import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Menu, Breadcrumb, Icon, message } from "antd";
import Link from "next/link";
import { Helmet } from "react-helmet";
import { useSetting } from "@/hooks/useSetting";
import { useRouter } from "next/router";
import { Login } from "@components/Login";
import { UserInfo } from "@components/admin/UserInfo";
import style from "./index.module.scss";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

const menus = [
  {
    icon: "dashboard",
    label: "首页",
    path: "/admin"
  },

  {
    icon: "form",
    label: "文章",
    children: [
      {
        label: "所有文章",
        path: "/admin/article"
      },
      {
        label: "新建文章",
        path: "/admin/article/editor"
      },
      {
        label: "标签管理",
        path: "/admin/article/tags"
      }
    ]
  },

  {
    icon: "form",
    label: "页面",
    children: [
      {
        label: "所有页面",
        path: "/admin/page"
      },
      {
        label: "新建页面",
        path: "/admin/page/editor"
      }
    ]
  },

  {
    icon: "message",
    label: "评论",
    path: "/admin/comment"
  },

  {
    icon: "folder-open",
    label: "文件",
    path: "/admin/file"
  },

  {
    icon: "setting",
    label: "系统设置",
    path: "/admin/setting"
  },

  {
    label: "个人中心",
    icon: "user",
    path: "/admin/ownspace"
  }
];

const resolveBreadcrumbs = pathname => {
  const breadcrumbs = [];

  for (let menu of menus) {
    if (menu.children) {
      let idx = menu.children.findIndex(item => item.path === pathname);
      if (idx > -1) {
        breadcrumbs.push(menu);
        breadcrumbs.push(menu.children[idx]);
        break;
      }
    } else {
      if (menu.path === pathname) {
        breadcrumbs.push(menu);
        break;
      }
    }

    menu.path === "/admin" && breadcrumbs.push(menu);
  }

  return breadcrumbs;
};

interface IAdminLayoutProps {
  background?: string;
  padding?: any;
}

export let showLogin = () => {};

export const AdminLayout: React.FC<IAdminLayoutProps> = ({
  children,
  background = "#fff",
  padding = 24
}) => {
  const setting = useSetting();
  const router = useRouter();
  const [loginVisible, setLoginVisible] = useState(false);
  const { pathname } = router;
  const breadcrumbs = resolveBreadcrumbs(pathname);

  useEffect(() => {
    showLogin = () => setLoginVisible(true);
  }, []);

  return (
    <Layout className={style.wrapper}>
      <Helmet>
        <title>{"管理后台 - " + setting.systemTitle}</title>
        <meta name="keyword" content={setting.seoKeyword} />
        <meta name="description" content={setting.seoDesc} />
        <link rel="shortcut icon" href={setting.systemFavicon} />
        <link
          href="//fonts.googleapis.com/css?family=Nunito:400,400i,700,700i&amp;display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <Header>
        <Row>
          <Col span={20}>
            <div className={style.logo}>管理后台</div>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[pathname]}
              style={{ lineHeight: "64px" }}
            >
              {menus.map(menu => {
                if (menu.children) {
                  return (
                    <SubMenu
                      key={menu.label}
                      title={
                        <span>
                          <Icon type={menu.icon} />
                          {menu.label}
                        </span>
                      }
                    >
                      {menu.children.map(subMenu => {
                        return (
                          <Menu.Item key={subMenu.path}>
                            <Link href={subMenu.path}>
                              <a>{subMenu.label}</a>
                            </Link>
                          </Menu.Item>
                        );
                      })}
                    </SubMenu>
                  );
                } else {
                  return (
                    <Menu.Item key={menu.path}>
                      <Link href={menu.path}>
                        <a>
                          <Icon type={menu.icon} />
                          {menu.label}
                        </a>
                      </Link>
                    </Menu.Item>
                  );
                }
              })}
            </Menu>
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <UserInfo />
          </Col>
        </Row>
      </Header>
      <Content
        style={{ padding: "0 50px", minHeight: "calc(100vh - 64px - 83px)" }}
      >
        <Breadcrumb style={{ margin: "16px 0" }}>
          {breadcrumbs.map(breadcrumb => {
            return (
              <Breadcrumb.Item key={breadcrumb.label}>
                {breadcrumb.path ? (
                  <Link href={breadcrumb.path}>
                    <a>{breadcrumb.label}</a>
                  </Link>
                ) : (
                  breadcrumb.label
                )}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
        <div
          style={{
            background,
            padding
          }}
        >
          {children}
        </div>
      </Content>
      <Login
        visible={loginVisible}
        onClose={() => {
          setLoginVisible(false);
        }}
        onLogin={() => {
          message.success("已重新登录");
          setLoginVisible(false);
        }}
      />
      <Footer style={{ textAlign: "center" }}>
        <p>Copyright &copy; 2019-{new Date().getFullYear()} 行文过活</p>
      </Footer>
    </Layout>
  );
};
