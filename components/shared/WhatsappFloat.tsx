import Link from "next/link";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";

export const WhatsappFloat = () => (
  <Link
    href="https://wa.me/56984752936"
    className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 transition hover:scale-105"
    aria-label="WhatsApp ONKIT MERCH"
  >
    <ChatBubbleBottomCenterTextIcon className="h-7 w-7" />
  </Link>
);
