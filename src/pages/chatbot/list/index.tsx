import PageHeader from '@/components/PageHeader';
import ChatBotList from '@/features/chatbot/ChatBotList';

const ChatbotListPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="챗봇 서비스 목록" />
      <ChatBotList />
    </div>
  );
};

export default ChatbotListPage;
