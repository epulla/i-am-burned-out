---
description: Set the burntout level (full | ultra | off) or report the current one
argument-hint: "[full|ultra|off]"
---

Load the `i-am-burntout` skill and apply it at level `$ARGUMENTS` for the rest of this conversation. Accept only `full`, `ultra`, or `off`; no argument reports the current level without changing it, reporting `full` if no level has been set. `off` restores normal behavior. Reject any other argument, leave the current level unchanged, and report `burntout: invalid level (use full, ultra, or off)`.

Reply with one line only: `burntout: <level>`.
