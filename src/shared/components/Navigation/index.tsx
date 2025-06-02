import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/shared/components/ui/sidebar';
import { ChevronDown } from 'lucide-react';

const ITEMS = [
  {
    title: '대시보드',
    url: '/',
  },
  {
    title: '회원사관리',
    subItems: [
      { title: '회원사목록', url: '/organizations/list' },
      { title: '회원사신규등록', url: '/organizations/register' },
      { title: '서비스관리', url: '#/organizations/settings' },
    ],
  },
  {
    title: '지식베이스 관리',
    subItems: [
      { title: '지식베이스 목록', url: '/knowledge-bases/list' },
      { title: '지식베이스 생성', url: '/knowledge-bases/register' },
    ],
  },
  {
    title: '데이터 소스 관리',
    subItems: [
      { title: '디렉토리 관리', url: '/datasource/dirmanager' },
      { title: 'RDB 연계 관리', url: '#/datasource/rdb' },
    ],
  },
  {
    title: '서비스 관리',
    subItems: [
      { title: '챗봇 서비스 목록', url: '/chatbot/list' },
      { title: '챗봇 서비스 생성', url: '/chatbot/register' },
    ],
  },
  {
    title: '정산관리',
    url: '#',
  },
  {
    title: '통계',
    url: '#',
  },
];

const Navigation = () => {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (menuTitle: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-5">
        <p className="text-2xl font-bold">Sync-Insight</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>운영관리</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => {
                if (item.subItems) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => toggleSubMenu(item.title)}
                        className="flex w-full items-center justify-between"
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubMenus[item.title]
                              ? 'rotate-180 transform'
                              : ''
                          }`}
                        />
                      </SidebarMenuButton>
                      {openSubMenus[item.title] && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild>
                                <Link to={subItem.url} className="pl-6">
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>footer</SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;
