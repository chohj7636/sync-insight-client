import ChatBotLLMConfig from './ChatBotLLMConfig';
import ChatBotLLMModel from './ChatBotLLMModel';
import ChatBotPreview from './ChatBotPreview';
import MessageConfig from './MessageConfig';
import PromptConfig from './PromptConfig';
import RetrieverConfig from './RetrieverConfig';

const ChatBotServiceDetail = () => {
  return (
    <div className="grid w-full grid-cols-2 gap-7">
      {/* left side */}
      <div className="w-full flex flex-col gap-7">
        <RetrieverConfig />
        <ChatBotLLMModel />
        <ChatBotLLMConfig />
        <PromptConfig />
        <MessageConfig />
      </div>

      {/* right side */}
      <div className="w-full">
        <ChatBotPreview />
      </div>
    </div>
  );
};

export default ChatBotServiceDetail;
