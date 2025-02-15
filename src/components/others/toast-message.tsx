import { AnimatePresence, motion } from "framer-motion";

interface ToastMessageProps {
  type: "success" | "error"; // Determines styling
  message: string;
  title: string,
  visible: boolean;
  onClose?: () => void; // Optional close callback
}

const ToastMessage: React.FC<ToastMessageProps> = ({ type, message, visible, title, onClose }) => {
  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`w-[1000px] min-h-[115px] rounded-md overflow-hidden flex flex-row items-center gap-x-[24px] px-[24px] shadow-sm border-l-[6.86px] mt-[38px] 
            ${isSuccess ? "bg-[#E1f9f0] border-[#34D399]" : "bg-[#FDECEC] border-[#F87171]"}`}
        >
          {/* Icon */}
          <div className="flex items-center justify-center">
            {isSuccess ? (
              <svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.0154724" width="32" height="32" rx="6" fill="#34D399" />
                <path d="M26.5749 10.8015L26.5622 10.7871L26.5484 10.7737C26.1734 10.4098 25.5812 10.4088 25.205 10.7706L15.9288 19.5017L11.4371 15.263C11.0609 14.9009 10.4685 14.9018 10.0935 15.2658C9.70908 15.6389 9.70908 16.2413 10.0935 16.6143L10.0934 16.6144L10.0985 16.6192L14.803 21.0586C15.1116 21.3566 15.5245 21.5 15.9025 21.5C16.3127 21.5 16.6978 21.3525 17.0019 21.0588L26.483 12.1349C26.9037 11.7673 26.9042 11.1743 26.5749 10.8015Z" fill="white" stroke="white" />
              </svg>
            ) : (
              <svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.0154724" width="32" height="32" rx="6" fill="#F87171" />
                <path d="M10 10L26 26M26 10L10 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col flex-1">
            <span className={`font-sans font-semibold text-base ${isSuccess ? "text-[#004434]" : "text-[#7A1F1F]"}`}>
              {isSuccess ? (title || "Success!") : "Error!"}
            </span>
            <span className="font-sans font-normal text-[#637381] text-base">{message}</span>
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#637381] hover:text-black transition"
            >
              ✖
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastMessage;
