---
description: Set the burnedout level (full | ultra | off) or report the current one
argument-hint: "[full|ultra|off]"
---

1. Unless `$ARGUMENTS` is `off`, load the `i-am-burned-out` skill before responding. For `off`, skip skill loading and restore normal behavior.
2. Apply level `$ARGUMENTS` for the rest of this conversation. Accept only `full`, `ultra`, or `off`; no argument reports the current level without changing it, reporting `full` if no level has been set. Reject any other argument, leave the current level unchanged, and report `burnedout: invalid level (use full, ultra, or off)`.
3. If no user request remains, reply with one line only: `burnedout: <level>`. If a request remains in this message, begin with `burnedout: <level>` and continue that request. For an invalid argument, reply with the exact invalid-level message and do not continue the request.
