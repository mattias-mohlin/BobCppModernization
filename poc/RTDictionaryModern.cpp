/*
 * Proof-of-Concept: Modernized RTDictionary Implementation
 * 
 * This demonstrates how the RTDictionary implementation can be simplified
 * using std::unordered_map while maintaining API compatibility.
 */

#include "RTDictionaryModern.h"
#include <cstring>

// Constructor
RTDictionaryModern::RTDictionaryModern(unsigned initialSize)
{
    if (initialSize > 0) {
        // Reserve space to avoid rehashing
        _map.reserve(initialSize);
    }
    
    // Initialize cache
    _iteratorCache.key = nullptr;
    _iteratorCache.value = nullptr;
}

// Copy constructor
RTDictionaryModern::RTDictionaryModern(const RTDictionaryModern& other)
    : _map(other._map)
{
    _iteratorCache.key = nullptr;
    _iteratorCache.value = nullptr;
}

// Destructor
RTDictionaryModern::~RTDictionaryModern()
{
    // std::unordered_map handles cleanup automatically
    // No manual memory management needed!
}

// Assignment operator
RTDictionaryModern& RTDictionaryModern::operator=(const RTDictionaryModern& other)
{
    if (this != &other) {
        _map = other._map;
    }
    return *this;
}

// Add or update a key-value pair
int RTDictionaryModern::atPut(const char* key, void* value)
{
    if (key == nullptr) {
        return 0; // keys must be non-null
    }
    
    std::string keyStr(key);
    
    // Check if key already exists
    if (_map.find(keyStr) != _map.end()) {
        return 0; // key already exists (original behavior)
    }
    
    // Insert new entry
    _map[keyStr] = value;
    return 1;
}

// Remove an entry
int RTDictionaryModern::remove(const char* key)
{
    if (key == nullptr) {
        return 0;
    }
    
    std::string keyStr(key);
    auto it = _map.find(keyStr);
    
    if (it != _map.end()) {
        _map.erase(it);
        return 1;
    }
    
    return 0;
}

// Lookup operator
void* RTDictionaryModern::operator[](const char* key) const
{
    if (key == nullptr) {
        return nullptr;
    }
    
    std::string keyStr(key);
    auto it = _map.find(keyStr);
    
    if (it != _map.end()) {
        return it->second;
    }
    
    return nullptr;
}

// Iterate through entries
const RTAssociation* RTDictionaryModern::iterate(Iterator& iter) const
{
    // Initialize iterator on first call
    if (iter._it == iter._end) {
        iter._it = _map.begin();
        iter._end = _map.end();
    }
    
    // Check if we've reached the end
    if (iter._it == iter._end) {
        return nullptr;
    }
    
    // Update cache with current entry
    // Note: We need to cast away const to store the key pointer
    // This is safe because we're only reading from it
    _iteratorCache.key = const_cast<char*>(iter._it->first.c_str());
    _iteratorCache.value = iter._it->second;
    
    // Advance iterator
    ++iter._it;
    
    return &_iteratorCache;
}

// Static hash function (kept for API compatibility)
unsigned RTDictionaryModern::hash(const char* str, unsigned size)
{
    // This is kept for API compatibility but not used internally
    // std::unordered_map uses its own hash function
    
    if (str == nullptr || size == 0) {
        return 0;
    }
    
    unsigned hash = 0;
    while (*str) {
        hash = (hash << 5) + hash + static_cast<unsigned char>(*str++);
    }
    
    return hash % size;
}

// Made with Bob
