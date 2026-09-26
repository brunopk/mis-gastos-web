#!/usr/bin/env bash

# Format a raw token count compactly: raw if < 1000, Xk if < 1M, XM otherwise.
fmt_tokens() {
  local n=$1
  if [ "$n" -ge 1000000 ]; then
    awk "BEGIN { printf \"%.1fM\", $n/1000000 }"
  elif [ "$n" -ge 1000 ]; then
    awk "BEGIN { printf \"%.1fk\", $n/1000 }"
  else
    echo "$n"
  fi
}

input=$(cat)

total_cost=$(echo "$input" | jq -r '.cost.total_cost_usd // empty')
if [ -n "$total_cost" ]; then
  cost_seg=$(awk "BEGIN { printf \"\$%.4f\", $total_cost }")
else
  cost_seg=""
fi

model=$(echo "$input" | jq -r '.model.display_name')
cwd=$(echo "$input" | jq -r '.workspace.current_dir')
branch=$(git -C "$cwd" --no-optional-locks symbolic-ref --short HEAD 2>/dev/null)

usage=$(echo "$input" | jq '.context_window.current_usage')
if [ "$usage" != "null" ]; then
  input_tokens=$(echo "$usage"    | jq '.input_tokens')
  output_tokens=$(echo "$usage"   | jq '.output_tokens')
  cache_read=$(echo "$usage"      | jq '.cache_read_input_tokens')
  cache_write=$(echo "$usage"     | jq '.cache_creation_input_tokens')
  current=$(echo "$usage" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
  size=$(echo "$input" | jq '.context_window.context_window_size')
  pct=$((current * 100 / size))
else
  input_tokens=0
  output_tokens=0
  cache_read=0
  cache_write=0
  pct=0
fi

# Build colored bar (20 chars wide, each char = 5%)
filled=$((pct * 20 / 100))
empty=$((20 - filled))

if [ "$pct" -gt 75 ]; then
  color="\033[31m"   # red
elif [ "$pct" -ge 50 ]; then
  color="\033[33m"   # yellow
else
  color="\033[32m"   # green
fi
reset="\033[0m"

bar=""
for i in $(seq 1 $filled); do bar="${bar}▮"; done
for i in $(seq 1 $empty);  do bar="${bar}▯"; done

# Build token segment: ↑ total input sent to model, ↓ output received from model
# Cache read shown in parentheses after input total, only if > 0
total_input=$((input_tokens + cache_read + cache_write))
token_seg="↑$(fmt_tokens $total_input)"
if [ "$cache_read" -gt 0 ]; then
  token_seg="$token_seg (⚡$(fmt_tokens $cache_read))"
fi
token_seg="$token_seg ↓$(fmt_tokens $output_tokens)"

# Build session totals segment
total_in=$(echo "$input" | jq '.context_window.total_input_tokens')
total_out=$(echo "$input" | jq '.context_window.total_output_tokens')
totals_seg="∑↑$(fmt_tokens $total_in) ∑↓$(fmt_tokens $total_out)"

# Assemble status line
dir=$(basename "$cwd")
prefix=""
if [ -n "$cost_seg" ]; then
  prefix="${cost_seg} | "
fi
if [ -n "$branch" ]; then
  printf "%s%s | ${color}%s${reset} %d%% | %s | %s\n%s | %s" "$prefix" "$model" "$bar" "$pct" "$token_seg" "$totals_seg" "$branch" "$dir"
else
  printf "%s%s | ${color}%s${reset} %d%% | %s | %s | %s" "$prefix" "$model" "$bar" "$pct" "$token_seg" "$totals_seg" "$dir"
fi