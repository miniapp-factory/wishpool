"use client";
import { useState } from "react";
import { description, title } from "@/lib/metadata";
import { generateMetadata } from "@/lib/farcaster-embed";

export { generateMetadata };

export default function Home() {
  const [view, setView] = useState<"list" | "wishlist" | "item">("list");
  const [wishlists, setWishlists] = useState<
    { id: string; title: string; description: string; items: { id: string; name: string; details: string }[] }[]
  >([]);
  const [currentWishlistId, setCurrentWishlistId] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  const addWishlist = (title: string, desc: string) => {
    const newWL = { id: Date.now().toString(), title, description: desc, items: [] };
    setWishlists([...wishlists, newWL]);
  };

  const addItem = (name: string, details: string) => {
    if (!currentWishlistId) return;
    setWishlists(
      wishlists.map((wl) =>
        wl.id === currentWishlistId
          ? { ...wl, items: [...wl.items, { id: Date.now().toString(), name, details }] }
          : wl
      )
    );
  };

  const sendSupport = (msg: string) => {
    console.log("Support message:", msg);
  };

  const currentWishlist = wishlists.find((wl) => wl.id === currentWishlistId);
  const currentItem = currentWishlist?.items.find((it) => it.id === currentItemId);

  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <h1 className="text-2xl">{title}</h1>
      <p className="text-muted-foreground">{description}</p>

      {view === "list" && (
        <div className="w-full max-w-md">
          <h2 className="text-xl mb-2">Wishlists</h2>
          <ul className="space-y-2">
            {wishlists.map((wl) => (
              <li key={wl.id} className="border p-2 rounded">
                <h3 className="font-semibold">{wl.title}</h3>
                <p>{wl.description}</p>
                <button
                  className="mt-1 text-blue-500"
                  onClick={() => {
                    setCurrentWishlistId(wl.id);
                    setView("wishlist");
                  }}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const title = (form.elements.namedItem("title") as HTMLInputElement).value;
              const desc = (form.elements.namedItem("description") as HTMLInputElement).value;
              addWishlist(title, desc);
              form.reset();
            }}
          >
            <h3 className="text-lg">Create Wishlist</h3>
            <input name="title" placeholder="Title" required className="border p-1 rounded" />
            <input name="description" placeholder="Description" required className="border p-1 rounded" />
            <button type="submit" className="bg-blue-500 text-white p-1 rounded">
              Add
            </button>
          </form>
        </div>
      )}

      {view === "wishlist" && currentWishlist && (
        <div className="w-full max-w-md">
          <button onClick={() => setView("list")} className="mb-2 text-blue-500">
            Back to lists
          </button>
          <h2 className="text-xl mb-2">{currentWishlist.title}</h2>
          <p>{currentWishlist.description}</p>
          <h3 className="text-lg mt-4">Items</h3>
          <ul className="space-y-2">
            {currentWishlist.items.map((it) => (
              <li key={it.id} className="border p-2 rounded">
                <h4 className="font-semibold">{it.name}</h4>
                <button
                  className="mt-1 text-blue-500"
                  onClick={() => {
                    setCurrentItemId(it.id);
                    setView("item");
                  }}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const details = (form.elements.namedItem("details") as HTMLInputElement).value;
              addItem(name, details);
              form.reset();
            }}
          >
            <h3 className="text-lg">Add Item</h3>
            <input name="name" placeholder="Item name" required className="border p-1 rounded" />
            <input name="details" placeholder="Details" required className="border p-1 rounded" />
            <button type="submit" className="bg-blue-500 text-white p-1 rounded">
              Add
            </button>
          </form>
        </div>
      )}

      {view === "item" && currentItem && (
        <div className="w-full max-w-md">
          <button onClick={() => setView("wishlist")} className="mb-2 text-blue-500">
            Back to wishlist
          </button>
          <h2 className="text-xl mb-2">{currentItem.name}</h2>
          <p>{currentItem.details}</p>
          <form
            className="mt-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const msg = (form.elements.namedItem("msg") as HTMLInputElement).value;
              sendSupport(msg);
              form.reset();
            }}
          >
            <h3 className="text-lg">Send Support</h3>
            <input name="msg" placeholder="Support message" required className="border p-1 rounded" />
            <button type="submit" className="bg-green-500 text-white p-1 rounded">
              Send
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
