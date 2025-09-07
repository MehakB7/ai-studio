import { Card, CardContent } from "@/components/ui/card";
import { ImageGenerationResponse } from "@/hooks/use-post-with-retry";
import { STYLES } from "@/lib/config";
import { Image } from "lucide-react";
import React from "react";
import { getRelativeTime } from "@/lib/utils";

const History = ({
  history,
  loadFromHistory,
}: {
  history: ImageGenerationResponse[];
  loadFromHistory: (item: ImageGenerationResponse) => void;
}) => {
  return (
    <div className="w-full sm:w-[500px]">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Generations</h2>

          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring flex items-center"
                  tabIndex={0}
                  role="button"
                  aria-label={`Load generation: ${item.prompt}`}
                  data-testid={`history-item-${index}`}
                  onClick={() => loadFromHistory(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      loadFromHistory(item);
                    }
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={`Generated ${item.style} style image`}
                    className="w-14 h-14 object-cover rounded-md mb-2"
                    data-testid={`history-image-${index}`}
                  />
                  <div className="flex flex-col ml-3 gap-4">
                    <p
                      className="text-xs text-muted-foreground text-wrap"
                      data-testid={`history-prompt-${index}`}
                    >
                      {item.prompt}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="bg-green-200 text-green-800 rounded-lg text-xs px-2 py-1 self-start"
                        data-testid={`history-style-${index}`}
                      >
                        {STYLES.find((s) => s.value === item.style)?.label}
                      </span>
                      <span
                        className="text-xs text-muted-foreground"
                        data-testid={`history-time-${index}`}
                      >
                        {getRelativeTime(item?.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" data-testid="history-empty">
              <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                No generations yet
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Your recent creations will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
