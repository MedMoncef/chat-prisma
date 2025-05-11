import { redirect } from "next/navigation";

export default function Home() {
  // We'll redirect to the chat page or login based on authentication status
  // The middleware will handle the right place to go
  redirect('/chat');
}
