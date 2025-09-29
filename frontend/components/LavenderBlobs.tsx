"use client";

export default function LavenderBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
      <div className="absolute top-40 left-40 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}