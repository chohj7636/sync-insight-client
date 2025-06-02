import { Route, Routes } from 'react-router-dom';

import DefaultLayout from './DefaultLayout';
import ChatbotListPage from './chatbot/list';
import ChatBotServiceDetailPage from './chatbot/list/detail';
import ChatbotRegisterPage from './chatbot/register';
import DirectoryManagerPage from './datasource/dirmanager';
import DirDetailPage from './datasource/dirmanager/detail';
import DirectoryRegisterPage from './datasource/register';
import KnowledgeBasesListPage from './knowledgeBases/list';
import KnowledgeDetailPage from './knowledgeBases/list/detail';
import KnowledgeBasesRegisterPage from './knowledgeBases/register';
import MainPage from './main';
import OrganizationsListPage from './organizations/list';
import OrganizationDetailPage from './organizations/list/detail';
import OrganizationRegisterPage from './organizations/register';
import Test1 from './test1';

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

        <Route path="/test1" element={<Test1 />} />
      </Route>
    </Routes>
  );
};

export default RootRouter;
