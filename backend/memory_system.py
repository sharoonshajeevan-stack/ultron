# ============================================================================
# MEMORY SYSTEM - Store and recall conversations
# File: D:\ULTRON-OS\backend\memory_system.py
# Purpose: Persistent memory for conversations and context
# ============================================================================

import json
import logging
from datetime import datetime
from pathlib import Path
import os

logger = logging.getLogger(__name__)

# ============================================================================
# MEMORY SYSTEM CLASS
# ============================================================================

class MemorySystem:
    """
    Stores and retrieves conversation memories.
    Supports short-term (session) and long-term (persistent) storage.
    """

    def __init__(self, storage_dir="memory"):
        self.storage_dir = storage_dir
        self.short_term_memory = []  # Current session
        self.long_term_memory = []   # Loaded from file
        self.max_short_term = 50     # Keep last 50 messages in session
        self.max_long_term = 1000    # Keep last 1000 messages in file
        self.memory_file = f"{storage_dir}/conversations.json"
        
        # Create storage directory if it doesn't exist
        Path(storage_dir).mkdir(exist_ok=True)
        
        # Load existing memories
        self._load_memories()
        
        logger.info("Memory System initialized")

    def _load_memories(self):
        """Load memories from file"""
        try:
            if os.path.exists(self.memory_file):
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.long_term_memory = data.get('memories', [])
                logger.info(f"Loaded {len(self.long_term_memory)} memories")
            else:
                logger.info("No existing memories found")
        except Exception as e:
            logger.error(f"Error loading memories: {e}")
            self.long_term_memory = []

    def _save_memories(self):
        """Save memories to file"""
        try:
            data = {
                "memories": self.long_term_memory,
                "last_saved": datetime.now().isoformat(),
                "total_memories": len(self.long_term_memory)
            }
            
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved {len(self.long_term_memory)} memories")
        except Exception as e:
            logger.error(f"Error saving memories: {e}")

    def add_conversation(self, user_input, ai_response, tags=None):
        """
        Add a conversation to memory
        
        Args:
            user_input (str): What user said/typed
            ai_response (str): AI's response
            tags (list): Optional tags for categorization
        
        Returns:
            dict: Memory entry
        """
        try:
            memory_entry = {
                "id": len(self.long_term_memory) + 1,
                "timestamp": datetime.now().isoformat(),
                "user_input": user_input,
                "ai_response": ai_response,
                "tags": tags or [],
                "importance": self._calculate_importance(user_input)
            }
            
            # Add to short-term (current session)
            self.short_term_memory.append(memory_entry)
            if len(self.short_term_memory) > self.max_short_term:
                self.short_term_memory.pop(0)
            
            # Add to long-term (persistent)
            self.long_term_memory.append(memory_entry)
            if len(self.long_term_memory) > self.max_long_term:
                self.long_term_memory.pop(0)
            
            # Save to file
            self._save_memories()
            
            logger.info(f"Memory added: {user_input[:50]}...")
            return memory_entry
        
        except Exception as e:
            logger.error(f"Error adding conversation: {e}")
            return None

    def get_recent_memories(self, limit=10):
        """Get recent memories"""
        return self.short_term_memory[-limit:] if self.short_term_memory else []

    def search_memories(self, keyword, limit=10):
        """
        Search memories by keyword
        
        Args:
            keyword (str): Search term
            limit (int): Max results
        
        Returns:
            list: Matching memories
        """
        try:
            results = []
            keyword_lower = keyword.lower()
            
            for memory in reversed(self.short_term_memory):
                if keyword_lower in memory['user_input'].lower() or \
                   keyword_lower in memory['ai_response'].lower():
                    results.append(memory)
                    if len(results) >= limit:
                        break
            
            logger.info(f"Found {len(results)} memories matching '{keyword}'")
            return results
        
        except Exception as e:
            logger.error(f"Error searching memories: {e}")
            return []

    def get_context(self, limit=5):
        """
        Get recent context for AI (last N conversations)
        
        Args:
            limit (int): Number of recent conversations
        
        Returns:
            str: Formatted context string
        """
        try:
            recent = self.get_recent_memories(limit)
            
            if not recent:
                return "No previous context."
            
            context = "Recent conversation history:\n"
            for memory in recent:
                context += f"User: {memory['user_input']}\n"
                context += f"Assistant: {memory['ai_response'][:100]}...\n\n"
            
            return context
        
        except Exception as e:
            logger.error(f"Error getting context: {e}")
            return "No context available."

    def get_memory_by_tag(self, tag, limit=10):
        """Get memories by tag"""
        try:
            results = [m for m in self.short_term_memory if tag in m.get('tags', [])]
            return results[-limit:] if results else []
        except Exception as e:
            logger.error(f"Error getting memories by tag: {e}")
            return []

    def _calculate_importance(self, text):
        """
        Calculate importance score (0-10)
        Higher score = more important
        """
        importance = 5  # Default
        
        important_keywords = ['remember', 'important', 'save', 'note', 'critical']
        if any(keyword in text.lower() for keyword in important_keywords):
            importance += 3
        
        # Longer messages might be more important
        if len(text) > 100:
            importance += 1
        
        return min(10, importance)

    def clear_session_memory(self):
        """Clear only current session memory"""
        self.short_term_memory = []
        logger.info("Session memory cleared")
        return {"status": "success", "message": "Session memory cleared"}

    def clear_all_memory(self):
        """Clear all memory (DANGEROUS!)"""
        try:
            self.short_term_memory = []
            self.long_term_memory = []
            
            if os.path.exists(self.memory_file):
                os.remove(self.memory_file)
            
            logger.warning("ALL MEMORY CLEARED!")
            return {"status": "success", "message": "All memory cleared"}
        
        except Exception as e:
            logger.error(f"Error clearing memory: {e}")
            return {"status": "error", "message": str(e)}

    def get_status(self):
        """Get memory system status"""
        return {
            "short_term_count": len(self.short_term_memory),
            "long_term_count": len(self.long_term_memory),
            "memory_file": self.memory_file,
            "file_exists": os.path.exists(self.memory_file),
            "timestamp": datetime.now().isoformat()
        }

    def export_memories(self):
        """Export all memories"""
        return {
            "timestamp": datetime.now().isoformat(),
            "total": len(self.long_term_memory),
            "memories": self.long_term_memory
        }

    def get_stats(self):
        """Get memory statistics"""
        try:
            total_chars = sum(len(m['user_input']) + len(m['ai_response']) 
                            for m in self.long_term_memory)
            
            return {
                "total_conversations": len(self.long_term_memory),
                "session_conversations": len(self.short_term_memory),
                "total_characters": total_chars,
                "average_importance": sum(m.get('importance', 5) for m in self.long_term_memory) / max(1, len(self.long_term_memory)),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error calculating stats: {e}")
            return {}


# ============================================================================
# GLOBAL MEMORY INSTANCE
# ============================================================================

memory_system = MemorySystem()


# ============================================================================
# PUBLIC FUNCTIONS
# ============================================================================

def add_memory(user_input, ai_response, tags=None):
    """Add conversation to memory"""
    return memory_system.add_conversation(user_input, ai_response, tags)


def get_recent_memories(limit=10):
    """Get recent memories"""
    return memory_system.get_recent_memories(limit)


def search_memories(keyword, limit=10):
    """Search memories"""
    return memory_system.search_memories(keyword, limit)


def get_context(limit=5):
    """Get context for AI"""
    return memory_system.get_context(limit)


def get_memory_status():
    """Get memory status"""
    return memory_system.get_status()


def get_memory_stats():
    """Get memory statistics"""
    return memory_system.get_stats()


def clear_session():
    """Clear session memory"""
    return memory_system.clear_session_memory()


def clear_all():
    """Clear all memory"""
    return memory_system.clear_all_memory()


def export_all_memories():
    """Export all memories"""
    return memory_system.export_memories()