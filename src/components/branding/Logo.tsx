import { memo } from "react";

export default memo(function Logo() {
  return (
    <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      InfraPilot
    </div>
  );
});
