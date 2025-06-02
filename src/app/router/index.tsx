import { Route, Routes } from 'react-router-dom';

import DefaultLayout from '@/pages/DefaultLayout';
import ChatbotListPage from '@/pages/chatbot/list';
import ChatBotServiceDetailPage from '@/pages/chatbot/list/detail';
import ChatbotRegisterPage from '@/pages/chatbot/register';
import DirectoryManagerPage from '@/pages/datasource/dirmanager';
import DirDetailPage from '@/pages/datasource/dirmanager/detail';
import DirectoryRegisterPage from '@/pages/datasource/register';
import KnowledgeBasesListPage from '@/pages/knowledgeBases/list';
import KnowledgeDetailPage from '@/pages/knowledgeBases/list/detail';
import KnowledgeBasesRegisterPage from '@/pages/knowledgeBases/register';
import MainPage from '@/pages/main';
import OrganizationsListPage from '@/pages/organizations/list';
import OrganizationDetailPage from '@/pages/organizations/list/detail';
import OrganizationRegisterPage from '@/pages/organizations/register';

const RootRouter = () => {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index path="/" element={<MainPage />} />
        {/* 회원사 관리 */}
        <Route path="/organizations/list" element={<OrganizationsListPage />} />
        <Route
          path="/organizations/list/:organId"
          element={<OrganizationDetailPage />}
        />
        <Route
          path="/organizations/register"
          element={<OrganizationRegisterPage />}
        />

        {/* 데이터소스 관리 */}
        <Route
          path="/datasource/dirmanager"
          element={<DirectoryManagerPage />}
        />
        <Route path="/datasource/detail/:dirId" element={<DirDetailPage />} />
        <Route
          path="/datasource/register"
          element={<DirectoryRegisterPage />}
        />

        {/* 지식베이스 */}
        <Route
          path="/knowledge-bases/list"
          element={<KnowledgeBasesListPage />}
        />
        <Route
          path="/knowledge-bases/list/:knowledgeBaseId"
          element={<KnowledgeDetailPage />}
        />
        <Route
          path="/knowledge-bases/register"
          element={<KnowledgeBasesRegisterPage />}
        />

        {/* 챗봇 서비스 */}
        <Route path="/chatbot/list" element={<ChatbotListPage />} />
        <Route path="/chatbot/register" element={<ChatbotRegisterPage />} />
        <Route
          path="/chatbot/list/:chatbotId"
          element={<ChatBotServiceDetailPage />}
        />
      </Route>
    </Routes>
  );
};

export default RootRouter;
