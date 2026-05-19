import { Terminal } from "@/components/terminal/Terminal";

export default function HomePage() {
  return <Terminal bootCommand="whoami" fullscreen />;
}
