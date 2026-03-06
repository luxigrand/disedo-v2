"use client";

import { Hash } from "lucide-react";

interface Server {
  id: string;
  name: string;
  icon_url?: string;
  categories: Category[];
  channels: Channel[];
}

interface Category {
  id: string;
  name: string;
  position: number;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  category_id?: string;
  position: number;
}

interface ServerSidebarProps {
  servers: Server[];
}

export default function ServerSidebar({ servers }: ServerSidebarProps) {
  const selectedServerId = servers.length > 0 ? servers[0].id : null;
  const selectedServer = servers.find((s) => s.id === selectedServerId);

  // Kanalları kategoriye göre grupla
  const getChannelsByCategory = (server: Server) => {
    const channelsWithCategory = server.channels.filter((c) => c.category_id);
    const channelsWithoutCategory = server.channels.filter((c) => !c.category_id);

    const categoryMap = new Map<string, Channel[]>();
    server.categories.forEach((cat) => {
      categoryMap.set(
        cat.id,
        channelsWithCategory
          .filter((c) => c.category_id === cat.id)
          .sort((a, b) => a.position - b.position)
      );
    });

    return {
      categorized: Array.from(categoryMap.entries())
        .map(([categoryId, channels]) => {
          const category = server.categories.find((c) => c.id === categoryId);
          return { category, channels };
        })
        .sort((a, b) => (a.category?.position || 0) - (b.category?.position || 0)),
      uncategorized: channelsWithoutCategory.sort((a, b) => a.position - b.position),
    };
  };

  if (servers.length === 0) {
    return null;
  }

  const channelsData = selectedServer ? getChannelsByCategory(selectedServer) : null;

  return (
    <div className="flex h-screen bg-[#2b2d31] text-white">
      {/* Server Listesi (Sol Sidebar) */}
      <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 gap-2">
        {servers.map((server) => (
          <div
            key={server.id}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              selectedServerId === server.id
                ? "bg-[#5865f2] rounded-2xl"
                : "bg-[#36393f]"
            }`}
          >
            {server.icon_url ? (
              <img
                src={server.icon_url}
                alt={server.name}
                className="w-full h-full rounded-full"
              />
            ) : (
              <span className="text-lg font-semibold">
                {server.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Kanallar Sidebar */}
      {selectedServer && (
        <div className="w-[240px] bg-[#2f3136] flex flex-col">
          {/* Server Adı */}
          <div className="h-12 px-4 flex items-center border-b border-[#202225] shadow-sm">
            <h2 className="font-semibold text-base">{selectedServer.name}</h2>
          </div>

          {/* Kanallar Listesi */}
          <div className="flex-1 overflow-y-auto px-2 py-4">
            {channelsData?.categorized.map(({ category, channels }) => (
              <div key={category?.id} className="mb-4">
                {category && (
                  <div className="px-2 mb-1">
                    <h3 className="text-xs font-semibold text-[#8e9297] uppercase tracking-wide">
                      {category.name}
                    </h3>
                  </div>
                )}
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="px-2 py-1 rounded flex items-center gap-1.5 text-[#96989d]"
                  >
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">{channel.name}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Kategorisiz Kanallar */}
            {channelsData?.uncategorized.length > 0 && (
              <div className="mb-4">
                {channelsData.uncategorized.map((channel) => (
                  <div
                    key={channel.id}
                    className="px-2 py-1 rounded flex items-center gap-1.5 text-[#96989d]"
                  >
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">{channel.name}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedServer.channels.length === 0 && (
              <div className="px-2 text-sm text-[#8e9297]">
                Bu server'da kanal yok
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
