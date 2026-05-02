/*
 * Proof-of-Concept: Modernized RTDictionary using std::unordered_map
 * 
 * This is a demonstration of how RTDictionary can be refactored to use
 * C++ Standard Library containers while maintaining API compatibility.
 * 
 * Key Changes:
 * - Uses std::unordered_map<std::string, void*> internally
 * - Maintains the same public API for backward compatibility
 * - Eliminates manual memory management and hash table implementation
 * - Provides better performance through standard library optimizations
 */

#ifndef __RTDictionaryModern_h__
#define __RTDictionaryModern_h__

#include <unordered_map>
#include <string>

#ifndef __RTConfig_h__
#include <RTConfig.h>
#endif

#ifndef __RTAssociation_h__
#include <RTAssociation.h>
#endif

/**
 * Modernized RTDictionary using std::unordered_map
 * 
 * This class maintains API compatibility with the original RTDictionary
 * while using std::unordered_map internally for improved performance
 * and reduced maintenance burden.
 */
class RTDictionaryModern
{
protected:
    // Internal storage using standard library
    std::unordered_map<std::string, void*> _map;
    
    // Cache for RTAssociation objects returned by iterate()
    // This is needed to maintain API compatibility
    mutable RTAssociation _iteratorCache;

public:
    /**
     * Constructor with optional initial capacity hint
     * @param initialSize Initial capacity (passed to unordered_map::reserve)
     */
    explicit RTDictionaryModern(unsigned initialSize = 0);
    
    /**
     * Copy constructor
     */
    RTDictionaryModern(const RTDictionaryModern& other);
    
    /**
     * Destructor
     */
    ~RTDictionaryModern();
    
    /**
     * Assignment operator
     */
    RTDictionaryModern& operator=(const RTDictionaryModern& other);

    /**
     * Get the number of entries in the dictionary
     * @return Number of key-value pairs
     */
    RTS_INLINE unsigned size() const;

    /**
     * Add or update a key-value pair
     * @param key The key (must not be nullptr)
     * @param value The value to associate with the key
     * @return 1 if added, 0 if key already exists
     */
    int atPut(const char* key, void* value);
    
    /**
     * Add an association
     * @param assoc The association to add
     * @return 1 if added, 0 if key already exists
     */
    RTS_INLINE int add(const RTAssociation& assoc);
    
    /**
     * Remove an entry by key
     * @param key The key to remove
     * @return 1 if removed, 0 if key not found
     */
    int remove(const char* key);
    
    /**
     * Lookup a value by key
     * @param key The key to look up
     * @return The associated value, or nullptr if not found
     */
    void* operator[](const char* key) const;

    /**
     * Iterator class for traversing the dictionary
     * Maintains API compatibility with original implementation
     */
    class Iterator
    {
        friend class RTDictionaryModern;
    private:
        // Use standard library iterator internally
        std::unordered_map<std::string, void*>::const_iterator _it;
        std::unordered_map<std::string, void*>::const_iterator _end;
        
    public:
        RTS_INLINE Iterator();
        RTS_INLINE ~Iterator();
        RTS_INLINE void reset();
    };

    /**
     * Iterate through dictionary entries
     * @param iter Iterator object to track position
     * @return Pointer to next association, or nullptr when done
     */
    const RTAssociation* iterate(Iterator& iter) const;
    
    /**
     * Static hash function (kept for API compatibility, but not used internally)
     * @param str String to hash
     * @param size Table size
     * @return Hash value
     */
    static unsigned hash(const char* str, unsigned size);
};

// Inline implementations

inline unsigned RTDictionaryModern::size() const
{
    return static_cast<unsigned>(_map.size());
}

inline int RTDictionaryModern::add(const RTAssociation& assoc)
{
    return atPut(assoc.key, assoc.value);
}

inline RTDictionaryModern::Iterator::Iterator()
{
    // Iterator will be initialized when used with iterate()
}

inline RTDictionaryModern::Iterator::~Iterator()
{
}

inline void RTDictionaryModern::Iterator::reset()
{
    // Reset will be handled in iterate() method
}

#endif // __RTDictionaryModern_h__

// Made with Bob
