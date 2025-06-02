import ChatBotList from '@/features/chatbot/ChatBotList';
import PageHeader from '@/shared/components/PageHeader';

const ChatbotListPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="챗봇 서비스 목록" />
      <ChatBotList />
    </div>
  );
};

export default ChatbotListPage;
