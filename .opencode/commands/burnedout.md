---
description: Set the burnedout level (full | ultra | off) or report the current one
---

Load the `i-am-burned-out` skill and apply it at level `$ARGUMENTS` for the rest of this conversation. Accept only `full`, `ultra`, or `off`; no argument reports the current level without changing it, reporting `full` if no level has been set. `off` restores normal behavior. Reject any other argument, leave the current level unchanged, and report `burnedout: invalid level (use full, ultra, or off)`.

Reply with one line only: `burnedout: <level>`.
