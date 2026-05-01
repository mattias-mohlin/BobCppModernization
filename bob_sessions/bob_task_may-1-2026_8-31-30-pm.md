**User:**

<task>
Create a custom mode to be used when writing documentation in TargetRTS header files. Derive best practises for how documentation comments should look from the file RTActor.h.
</task>
<environment_details>
# VSCode Visible Files
..\..\..\..\..\IBM Bob\vscode.git.Git.log,..\..\..\..\..\bob\BobCppModernization\.bob\custom_modes.yaml

# VSCode Open Tabs
../../../.gitignore,COMPILE_COMMANDS_IMPL_PLAN.md,../../../../../bob/BobCppModernization/README.md,README.md,../../../../../bob/BobCppModernization/compilation_db_generation/README.md,../../../../../bob/git/BobCppModernization/README.md,include/RTActor.h,../../../../../bob/git/BobCppModernization/.bob/custom_modes.yaml,../../../../../bob/BobCppModernization/.bob/custom_modes.yaml,compile_commands.json,src/target/win/RTSyncObject.h,../../../../../bob/BobCppModernization/compilation_db_generation/generate-compile-commands.js,src/RTTracer/traceMessage.cc,src/RTAbortController/dt.cc

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:30:25.699Z
User time zone: Europe/Paris, UTC+2:00

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>


# Current Workspace Directory (c:/git/rsarte-target-rts/rsa_rt/C++/TargetRTS) Files
README.md
.cache/
.externalToolBuilders/
.settings/
a/
b/
build-LinuxT.x64-gcc-12.x/
build-WinT.x64-MinGw-12.2.0/
build-WinT.x64-VisualC++-17.0/
codegen/
config/
include/
include/RTActiveConnector.h
include/RTActor_class.h
include/RTActor.h
include/RTActor.inl
include/RTActorClass.h
include/RTActorFactory.h
include/RTActorFactoryInterface.h
include/RTActorId.h
include/RTActorId.inl
include/RTActorRef.h
include/RTActorRef.inl
include/RTAsciiDecoding.h
include/RTAsciiEncoding.h
include/RTAssociation.h
include/RTBindingDescriptor.h
include/RTBindingEnd.h
include/RTBoolean.h
include/RTBoolean.inl
include/RTByteBlock.h
include/RTByteBlock.inl
include/RTCachedString.h
include/RTCachedString.inl
include/RTcActors.h
include/RTCharacter.h
include/RTCharacter.inl
include/RTComponentDescriptor.h
include/RTConfig.h
include/RTConnector.h
include/RTController.h
include/RTController.inl
include/RTCounts.h
include/RTCustomController.h
include/RTDataObject.h
include/RTDataObject.inl
include/RTDecoding.h
include/RTDefaultActorFactory.h
include/RTDictionary.h
include/RTDictionary.inl
include/RTDynamicStringOutBuffer.h
include/RTEncoding.h
include/RTEnumerated.h
include/RTEnumerated.inl
include/RTEventReception.h
include/RTEventReceptionInterface.h
include/RTEventReceptionMsg.h
include/RTException.h
include/RTException.inl
include/RTExceptionSignal.h
include/RTExceptionSignal.inl
include/RTExternal.h
include/RTExternal.inl
include/RTFieldDescriptor.h
include/RTFieldOffset.h
include/RTFormat.h
include/RTFrame.h
include/RTFrame.inl
include/RTIBuffer.h
include/RTInjector.h
include/RTInSignal.h
include/RTInSignal.inl
include/RTInteger.h
include/RTInteger.inl
include/RTInterfaceDescriptor.h
include/RTInterval.h
include/RTInterval.inl
include/RTJob.h
include/RTJob.inl
include/RTJsonDecoding.h
include/RTJsonEncoding.h
include/RTJsonParser.h
include/RTJsonParserUtils.h
include/RTJsonParserUtils.inl
include/RTJsonResult.h
include/RTJsonResult.inl
include/RTLayerConnector.h
include/RTLayerConnector.inl
include/RTLayerData.h
include/RTLayerData.inl
include/RTLibSet.h
include/RTLocalBindingDescriptor.h
include/RTLock.h
include/RTLog.h
include/RTLog.inl
include/RTLogStream.h
include/RTMain.h
include/RTMain.inl
include/RTMemoryInBuffer.h
include/RTMemoryOutBuffer.h
include/RTMemoryUtil.h
include/RTMessage.h
include/RTMessage.inl
include/RTMessageQ.h
include/RTMessageQ.inl
include/RTMultiReceive.h
include/RTnew.h
include/RTObject_class.h
include/RTObject_class.inl
include/RTOBuffer.h
include/RTOutSignal.h
include/RTOutSignal.inl
include/RTPeerController.h
include/RTPointer.h
include/RTPointer.inl
include/RTPortDescriptor.h
include/RTPriority.h
include/RTPriority.inl
include/RTProtocol.h
include/RTProtocol.inl
include/RTProtocolDescriptor.h
include/RTProtocolDescriptor.inl
include/RTReal.h
include/RTReal.inl
include/RTRelayDescriptor.h
include/RTResourceMgr.h
include/RTRootProtocol.h
include/RTRootProtocol.inl
include/RTSequence.h
include/RTSequence.inl
include/RTSequenceOf.h
include/RTSequenceOf.inl
include/RTSignal.h
include/RTSignal.inl
include/RTSignalDescriptor.h
include/RTSoleController.h
include/RTStreamBuffer.h
include/RTString.h
include/RTString.inl
include/RTStructures.h
include/RTSymmetricSignal.h
include/RTSymmetricSignal.inl
include/RTSystemDescriptor.h
include/RTTcpSocket.h
include/RTThread.h
include/RTTime.h
include/RTTime.inl
include/RTTimerId.h
include/RTTimerId.inl
include/RTTimespec.h
include/RTTimespec.inl
include/RTTiming.h
include/RTTiming.inl
include/RTTimingChrono.inl
include/RTTracer.h
include/RTTracer.inl
include/RTTypedValue.h
include/RTTypedValue.inl
include/RTTypeModifier.h
include/RTUnknownObject.h
include/RTVAsciiDecoding.h
include/RTVAsciiEncoding.h
include/RTVersion.h
include/RTVersionId.h
include/RTWrapper.h
include/RTWrapper.inl
lib/
libset/
libset/x64-gcc-4.x/libset.mk
libset/x64-gcc-7.x/libset.mk
libset/x64-VisualC++-17.0/ld.pl
libset/x64-VisualC++-17.0/libset.mk
libset/x64-VisualC++-17.0/RTLibSet.h
libset/x86-VisualC++-17.0/ld.pl
libset/x86-VisualC++-17.0/libset.mk
libset/x86-VisualC++-17.0/RTLibSet.h
src/
src/RTInjector/create.cc
src/RTInjector/ct.cc
src/RTInjector/dt.cc
src/RTInjector/getCreateFunction.cc
src/RTInjector/registerCreateFunction.cc
src/RTJsonDecoding/ct.cc
src/RTJsonDecoding/dt.cc
src/RTJsonDecoding/get_address.cc
src/RTJsonDecoding/get_array.cc
src/RTJsonDecoding/get_enum.cc
src/RTJsonDecoding/get_indirect.cc
src/RTJsonDecoding/get_opaque.cc
src/RTJsonDecoding/get_struct.cc
src/RTJsonDecoding/get.cc
src/RTJsonDecoding/getArrayFinish.cc
src/RTJsonDecoding/getArrayStart.cc
src/RTJsonDecoding/getCharQuote.cc
src/RTJsonDecoding/getColonSeparator.cc
src/RTJsonDecoding/getFieldName.cc
src/RTOBuffer/ct.cc
src/RTOBuffer/dt.cc
src/RTOBuffer/unused.cc
tools/

(File list truncated. Use list_files on specific subdirectories if you need to explore further.)
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll help you create a custom mode for writing documentation in TargetRTS header files. First, let me read the RTActor.h file to understand the documentation style and best practices.

<read_file>
<args>
  <file>
    <path>include/RTActor.h</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 'include/RTActor.h'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>include/RTActor.h</path>
<content lines="1-408">
  1 | /*
  2 |  * Licensed Materials - Property of HCL and/or IBM
  3 |  * Copyright HCL Technologies Ltd. 2016, 2021. All Rights Reserved.
  4 |  * Copyright IBM Corporation 1999, 2016. All Rights Reserved.
  5 |  *
  6 |  * U.S. Government Users Restricted Rights -  Use, duplication or 
  7 |  * disclosure restricted by GSA ADP Schedule.
  8 |  */
  9 | 
 10 | #ifndef __RTActor_h__
 11 | #define __RTActor_h__ included
 12 | 
 13 | #ifdef PRAGMA
 14 | #pragma interface
 15 | #endif
 16 | 
 17 | #ifndef __RTController_h__
 18 | #include <RTController.h>
 19 | #endif
 20 | 
 21 | #ifndef __RTVersionId_h__
 22 | #include <RTVersionId.h>
 23 | #endif
 24 | 
 25 | struct RTActorClass;
 26 | class  RTActorProbe;
 27 | class  RTActorRef;
 28 | struct RTActor_class;
 29 | struct RTBindingEnd;
 30 | struct RTComponentDescriptor;
 31 | class  RTDebugger;
 32 | union  RTImportList;
 33 | class  RTMessage;
 34 | struct RTObject_class;
 35 | class  RTProtocol;
 36 | class  RTRelayPort;
 37 | 
 38 | /** An instance of this class represents a capsule instance. All classes that are generated for
 39 |  capsules inherit from this class.
 40 |  @see RTActorId is a wrapper object around an RTActor pointer and hence also represents a capsule
 41 |  instance
 42 |  */
 43 | class RTActor
 44 | {
 45 |     friend class RTActorRef;
 46 |     friend class RTController;
 47 |     friend class RTDebugger;
 48 |     friend class RTMessage;
 49 |     friend class RTProtocol;
 50 | 
 51 | private: // instance data
 52 |     RTController      * rts;
 53 |     RTActorRef        * homeReference;
 54 |     int                 homeIndex;
 55 |     RTRelayPort       * relays;
 56 | #if DEFER_IN_ACTOR
 57 |     RTMessageQ          deferredQ;
 58 | #endif
 59 | #if SUSPEND
 60 |     RTMessage         * suspendMsgs; // stack of messages which arrived while the actor was suspended
 61 | #endif
 62 | 
 63 |     RTImportList      * importList;
 64 | 
 65 |     struct State
 66 |     {
 67 |     	RTStateId          current;
 68 | #if RTStateId_MaxSize > 1
 69 |     	unsigned char      idShift; // log2( log256( getNumStates() ) )
 70 | #endif
 71 |     	union
 72 | 		{
 73 |     		unsigned char  s1[ 1 ];
 74 | #if RTStateId_MaxSize > 1
 75 |     		unsigned short s2[ 1 ];
 76 | #endif
 77 | #if RTStateId_MaxSize > 2
 78 |     		unsigned int   s4[ 1 ];
 79 | #endif
 80 | 		} history;
 81 |     };
 82 | 
 83 |     State             * state;
 84 | 
 85 | public: // instance data
 86 | 
 87 |     /** The message which is currently being processed by the capsule instance. */
 88 |     const RTMessage   * msg;
 89 | 
 90 | #if OBSERVABLE
 91 |     /** A probe attached to the capsule instance for monitoring it. */
 92 |     RTActorProbe      * probe;
 93 | #endif
 94 | 
 95 | protected: // functions
 96 | 
 97 |     /** @deprecated This function does nothing. */
 98 |     RTS_INLINE void         saveHistory( void );
 99 | 
100 |     /** Force the state machine of the capsule instance into a particular state.
101 |      @param[in] s The numeric id of a state to be set as the active state. Make sure to pass an
102 |      id of a valid state, defined in the state machine of the capsule instance. If the state machine
103 |      is forced into an invalid state, unexpectedState() will be called.
104 |      */
105 |     RTS_INLINE void         setCurrentState( int s);
106 | 
107 |     /**
108 |      * This function is called when a message is dispatched to a capsule instance, but it
109 |      * isn't handled by its state machine. In most cases this indicates a problem in the
110 |      * application, and a call to unexpectedMessage() will then be performed.
111 |      * However, there is also the scenario where a message is unhandled because it
112 |      * was received before the state machine has been initialized. In that case a call to
113 |      * messageReceivedBeforeInitialized() will be performed instead.
114 |      */
115 |     virtual void            unhandledMessage( void );
116 | 
117 |     /** This function is called when a message is dispatched to the capsule instance, and when
118 |      there is no enabled transition in the current state that can be triggered to handle the
119 |      received message. The default implementation prints a message to stderr. You may override
120 |      the function to provide a different behavior.
121 |      */
122 |     virtual void            unexpectedMessage( void );
123 | 
124 |     /** This function is called if a message is dispatched to the capsule instance, before its
125 |      * initial transition has executed. The default behavior is to defer such messages, and recall
126 |      * them when executing the initial transition, to give the capsule instance a chance to handle them.
127 |      * You may override this function to provide a different behavior, for example to call
128 |      * unexpectedMessage() in case you don't expect this scenario to occur.
129 |      */
130 |     virtual void            messageReceivedBeforeInitialized( void );
131 | 
132 |     /** This function is called if the TargetRTS detects that the state machine of the capsule
133 |      instance in in an invalid state (i.e. the current state does not match any of the states
134 |      defined in the capsule state machine). This is an abnormal situation which will cause the
135 |      application to terminate.
136 |      */
137 |     void                    unexpectedState( void );
138 | 
139 | #if ! OBSERVABLE
140 |     RTS_INLINE
141 | #endif
142 | 	/** This function is called at the beginning of every generated chain function that corresponds
143 | 	 to a transition in the state machine. The parameters identifies the start of the transition chain.
144 | 	 Note that the first argument is implied by the second, but skipping it would require generation
145 | 	 of a mapping table which, on some architectures, could be larger than the code which passes the
146 | 	 argument.
147 | 	 @param[in] origin Identifies the start point of the chain. Numbers from 1 to getNumStates(),
148 | 	 inclusive, refer to states, larger numbers refer to choice-points.
149 | 	 @param[in] trans The name of the transition.
150 | 	 */
151 |     void                    rtgChainBegin( int origin, const char * trans );
152 | 
153 | #if ! OBSERVABLE
154 |     RTS_INLINE
155 | #endif
156 |     /** This function is called just before a user-defined transition effect executes. */
157 |     void                    rtgTransitionBegin( void );
158 | 
159 | #if ! OBSERVABLE
160 |     RTS_INLINE
161 | #endif
162 |     /** This function is called just after a user-defined transition effect has executed. */
163 |     void                    rtgTransitionEnd( void );
164 | 
165 |     void                    enterState( int );
166 |     virtual void            enterStateV( void );
167 | 
168 |     /** This function is called when the state machine of the capsule instance enters a new state.
169 |      The call is made immediately after the state has become active, before the entry action of
170 |      that state executes. The default implementation of this function does nothing. The function
171 |      can be overridden on a capsule that wants to perform some common actions whenever a new state
172 |      in its state machine becomes active. To override this function, simply add a new operation to
173 |      the capsule with the same name and prototype.
174 |      */
175 |     virtual void            rtgStateEntry( void );
176 | 
177 |     void                    exitState( const RTStateId parent[] );
178 |     virtual void            exitStateV( void );
179 |     void                    processHistory( void );
180 |     void                    exitToChainState( int, const RTStateId parent[] );
181 | 
182 |     void                    initializeAll( void );
183 | 
184 |     int                     removeImport( RTActorRef * ,RTController * initiator );
185 |     void                    removeAllImports( RTController * initiator );
186 | 
187 |     int                     _followIn( RTBindingEnd & end,
188 | 				       	   	   	   	   int portId,
189 | 									   int repIndex,
190 | 									   RTActorRef * importer );
191 | 
192 |     int                     _followOut( RTBindingEnd & end,
193 | 										int portId,
194 | 										int repIndex );
195 | 
196 |     void                    _unbind( RTActorRef * importer  ,RTController* initiator);
197 |     virtual void            _predestroy( void );
198 | 
199 | public: // functions
200 | 
201 |     /** Constructor. Never create a capsule instance directly using the new operator. Always
202 |      create a capsule instance using Frame::Base::incarnate(), or automatically at start-up by means
203 |      of fixed capsule parts.
204 |      */
205 | 	RTActor( RTController *, RTActorRef * );
206 | 
207 |     virtual ~RTActor( void );
208 | 
209 |     /** Get the index of this capsule instance in its container capsule part (the capsule part
210 |      where it was incarnated).
211 |      @return A zero-based index.
212 |      */
213 |     RTS_INLINE int          getIndex( void ) const;
214 | 
215 |     /** Get the index of this capsule instance in its container capsule part (the capsule part
216 | 	 where it was incarnated).
217 | 	 @return A 1-based index.
218 | 	 */
219 |     RTS_INLINE int          index( void ) const;
220 | 
221 |     /** Get the numeric id for the capsule part that contains this capsule instance.
222 |      @return A numeric id for the container capsule part that is unique within the capsule
223 |      */
224 |     RTS_INLINE int          getId( void ) const;
225 | 
226 |     /** Get the name of the capsule part that contains this capsule instance.
227 |      @return The name of the container capsule part. For the top capsule instance the string "Top"
228 |      is returned.
229 |      */
230 |     const char            * getName( void ) const;
231 | 
232 |     /** Get the capsule part that contains this capsule instance (the capsule part where it was
233 |      * incarnated).
234 | 	 @return The container capsule part.
235 | 	 */
236 |     RTS_INLINE RTActorRef * getReference( void ) const;
237 | 
238 |     /** Get the message which is currently being processed by the capsule instance.
239 |      @return The currently processed message.
240 |      */
241 |     RTS_INLINE const RTMessage * getMsg( void );
242 | 
243 |     /** Make a copy of a message and send it to this capsule instance. This function can for example
244 |      be used in order to defer the handling of a reply message, or in general where a message cannot
245 |      be completely handled in a single transition.
246 |      @param[in] msg A message (typically the one currently being processed by the capsule instance).
247 |      @return 1 in case the message was successfully copied and sent, 0 otherwise.
248 |      */
249 |     RTS_INLINE int          sendCopyToMe ( const RTMessage* msg );
250 | 
251 |     /** Defines the state machine behavior for this capsule instance. This function is implemented
252 |      in each concrete capsule subclass.
253 |      @param[in] signal The event of the currently processed message.
254 |      @param[in] port The port on which the currently processed message arrived.
255 |      */
256 |     virtual void            rtsBehavior( int signal, int port ) = 0;
257 | 
258 | #if LOG_MESSAGE
259 |     /** This function is called just before a received message is processed by the capsule instance.
260 |      The default implementation prints a message to the log (depending on the current debug level).
261 |      Override this function to perform any other general action before a message is processed.
262 |      */
263 |     virtual void            logMsg( void );
264 | #endif
265 | 
266 |     /** Get the controller which runs this capsule instance.
267 |      @return The controller object which runs this capsule instance.
268 |      */
269 |     RTS_INLINE RTController * context( void ) const;
270 | 
271 |     /** Determines if this capsule instance is currently active, i.e. is processing a message.
272 |      @return 1 if the capsule instance is active, 0 otherwise.
273 |      */
274 |     RTS_INLINE int          isActive( void ) const;
275 | 
276 |     virtual int             designLevel( void ) const;
277 | 
278 |     /** Get the name of the capsule.
279 |      @return Name of the capsule instance type.
280 |      */
281 |     RTS_INLINE const char * getTypeName( void ) const;
282 | 
283 |     RTS_INLINE RTVersionId  getVersion( void ) const;
284 | 
285 |     /** Determines if the type of this capsule instance is a particular capsule type.
286 |      @param[in] cap A capsule type.
287 |      @return 1 if the type of this capsule instance equals the capsule type, 0 otherwise.
288 |      */
289 |     RTS_INLINE int          isSameType( const RTActorClass * cap) const;
290 | 
291 |     /** Performs a lexical comparison between the name of the capsule with a specified string.
292 |      @param[in] str A string to compare the capsule name with.
293 |      @return 0 if the capsule type name equals the string. A negative or positive value is returned
294 |      depending on the result of comparing the first character that is different.
295 |      */
296 |     int                     isType( const char * str) const;
297 | 
298 | #if SUSPEND
299 |     void                    suspend( void );
300 |     void                    resume( void );
301 |     RTS_INLINE int          isSuspended( void ) const;
302 | #endif
303 | 
304 |     /** Get information (meta data) about the capsule, such as its name, ports, states etc. This
305 |      information is static and comes from the definition of the capsule.
306 |      @return Information about the capsule.
307 |      */
308 |     virtual const RTActor_class  * getActorData( void ) const = 0;
309 | 
310 |     /** Get the number of states in the capsule state machine.
311 |      @return Number of state machine states.
312 |      */
313 |     int                     getNumStates( void ) const;
314 | 
315 |     /** Get the name of one of the states in the capsule state machine.
316 |      @param[in] s The numeric identifier of a state.
317 |      @return The name of the specified state. An error string is returned in case of error (for
318 |      example if an invalid state id is specified).
319 |      */
320 |     const char            * getStateString( int s) const;
321 | 
322 |     /** Get the name of the currently active state in the capsule state machine.
323 |      @return The name of the currently active state.
324 |      */
325 |     const char            * getCurrentStateString( void ) const;
326 | 
327 |     /** Get the numeric id of the currently active state in the capsule state machine.
328 | 	 @return The id of the currently active state.
329 | 	 */
330 |     RTS_INLINE int          getCurrentState( void ) const;
331 | 
332 |     /** Get the numeric id of the previously active state in the capsule state machine.
333 | 	 @return The id of the state that was most previously active.
334 | 	 */
335 |     RTS_INLINE int          getHistory( int ) const;
336 | 
337 |     int                     _numComponents( void ) const;
338 |     RTActorRef            * _component( int compId );
339 | 
340 |     void                    _preinitialize( int _homeIndex,
341 | 					    					const RTComponentDescriptor * );
342 |     int                     initMe( const void           * data,
343 | 				    				const RTObject_class * type,
344 | 									RTController         * sender );
345 | 
346 | #if RTIMPORT_ISREFERENCEDBY_CHECK
347 |     int                     isReferencedBy( const RTActor * ) const;
348 | #endif
349 | 
350 |     /** Get the default capsule class for a capsule part contained in the capsule instance.
351 |      This function is used by the Frame service when incarnating capsules without specifying
352 |      the capsule type. The default implementation just returns the capsule that types the capsule
353 |      part. You may override the function to use a different capsule as the default capsule class.
354 |      @param[in] component A capsule part of the capsule instance.
355 |      @param[in] repIndex The index within the capsule part where the Frame service will insert the
356 |      capsule instance to be created. It is unused in the default implementation.
357 |      @return The default capsule class for the capsule part.
358 |      */
359 |     virtual const RTActorClass * defaultClass( RTActorRef & component,
360 | 					       	   	   	   	   	   int          repIndex );
361 | 
362 |     /** Get the default controller for a capsule part contained in the capsule instance.
363 |      This function is used by the Frame service when incarnating capsules without specifying
364 |      the controller to run the created capsule instance. The default implementation just returns
365 |      the controller of this capsule instance. You may override the function to use a different
366 |      controller as the default.
367 |      @param[in] component A capsule part of the capsule instance.
368 |      @param[in] repIndex The index within the capsule part where the Frame service will insert the
369 |      capsule instance to be created. It is unused in the default implementation.
370 |      @return The default controller for the capsule part.
371 |      */
372 |     virtual RTController  * defaultController( RTActorRef & component,
373 | 					       	   	   	   	   	   int          repIndex );
374 | 
375 |     void                    _incarnateAllFixed( void );
376 | 
377 |     // The functions below are generated by the toolset.
378 |     virtual int             _followOutV( RTBindingEnd & end,
379 | 										 int            compId,
380 | 										 int            portId,
381 | 										 int            portIndex );
382 | 
383 |     // This function is simply inherited unless the actor has additional
384 |     // (interface) ports or has excluded ports of its superclass.
385 |     virtual int             _followInV( RTBindingEnd & end,
386 | 										int            portId,
387 | 										int            repIndex );
388 | 
389 | protected:
390 |     /** Get the most recent error that occurred when using the TargetRTS. Call this function
391 |      immediately after a function has returned with an error code to find out more information about
392 |      the error that occurred.
393 |      @return An RTController::Error value describing the error that occurred most recently when
394 |      using the TargetRTS.
395 |      */
396 |     RTS_INLINE RTController::Error getError( void ) const;
397 | 
398 | private:
399 |     // unavailable methods
400 |     RTActor( const RTActor & );
401 |     RTActor & operator=( const RTActor & );
402 | }; //lint !e1712
403 | 
404 | #if RTS_INLINES
405 | #include <RTActor.inl>
406 | #endif
407 | 
408 | #endif // __RTActor_h__
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
..\..\..\..\..\IBM Bob\vscode.git.Git.log,..\..\..\..\..\bob\BobCppModernization\.bob\custom_modes.yaml

# VSCode Open Tabs
../../../.gitignore,COMPILE_COMMANDS_IMPL_PLAN.md,../../../../../bob/BobCppModernization/README.md,README.md,../../../../../bob/BobCppModernization/compilation_db_generation/README.md,../../../../../bob/git/BobCppModernization/README.md,include/RTActor.h,../../../../../bob/git/BobCppModernization/.bob/custom_modes.yaml,../../../../../bob/BobCppModernization/.bob/custom_modes.yaml,compile_commands.json,src/target/win/RTSyncObject.h,../../../../../bob/BobCppModernization/compilation_db_generation/generate-compile-commands.js,src/RTTracer/traceMessage.cc,src/RTAbortController/dt.cc

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:30:33.310Z
User time zone: Europe/Paris, UTC+2:00

# Current Cost
$0.04

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now let me fetch the instructions for creating a custom mode:

<fetch_instructions>
<task>create_mode</task>
</fetch_instructions>

---

**User:**

[fetch_instructions for 'create_mode'] Result:

Custom modes can be configured in two ways:
  1. Globally via 'c:\Users\MATTIAS.MOHLIN\AppData\Roaming\IBM Bob\User\globalStorage\ibm.bob-code\settings\custom_modes.yaml' (created automatically on startup)
  2. Per-workspace via '.bob/custom_modes.yaml' in the workspace root directory

When modes with the same slug exist in both files, the workspace-specific .bob/custom_modes.yaml version takes precedence. This allows projects to override global modes or define project-specific modes.


If asked to create a project mode, create it in .bob/custom_modes.yaml in the workspace root. If asked to create a global mode, use the global custom modes file.

- The following fields are required and must not be empty:
  * slug: A valid slug (lowercase letters, numbers, and hyphens). Must be unique, and shorter is better.
  * name: The display name for the mode
  * roleDefinition: A detailed description of the mode's role and capabilities
  * groups: Array of allowed tool groups (can be empty). Each group can be specified either as a string (e.g., "edit" to allow editing any file) or with file restrictions (e.g., ["edit", { fileRegex: "\.md$", description: "Markdown files only" }] to only allow editing markdown files)

- The following fields are optional but highly recommended:
  * description: A short, human-readable description of what this mode does (5 words)
  * whenToUse: A clear description of when this mode should be selected and what types of tasks it's best suited for. This helps the Orchestrator mode make better decisions.
  * customInstructions: Additional instructions for how the mode should operate

- For multi-line text, include newline characters in the string like "This is the first line.\nThis is the next line.\n\nThis is a double line break."

Both files should follow this structure (in YAML format):

customModes:
  - slug: designer  # Required: unique slug with lowercase letters, numbers, and hyphens
    name: Designer  # Required: mode display name
    description: UI/UX design systems expert  # Optional but recommended: short description (5 words)
    roleDefinition: >-
      You are Bob, a UI/UX expert specializing in design systems and frontend development. Your expertise includes:
      - Creating and maintaining design systems
      - Implementing responsive and accessible web interfaces
      - Working with CSS, HTML, and modern frontend frameworks
      - Ensuring consistent user experiences across platforms  # Required: non-empty
    whenToUse: >-
      Use this mode when creating or modifying UI components, implementing design systems,
      or ensuring responsive web interfaces. This mode is especially effective with CSS,
      HTML, and modern frontend frameworks.  # Optional but recommended
    groups:  # Required: array of tool groups (can be empty)
      - read     # Read files group (read_file, fetch_instructions, search_files, list_files, list_code_definition_names)
      - edit     # Edit files group (apply_diff, write_to_file) - allows editing any file
      # Or with file restrictions:
      # - - edit
      #   - fileRegex: \.md$
      #     description: Markdown files only  # Edit group that only allows editing markdown files
      - browser  # Browser group (browser_action)
      - command  # Command group (execute_command)
      - mcp      # MCP group (use_mcp_tool, access_mcp_resource)
    customInstructions: Additional instructions for the Designer mode  # Optional
<environment_details>
# VSCode Visible Files
..\..\..\..\..\IBM Bob\vscode.git.Git.log,..\..\..\..\..\bob\BobCppModernization\.bob\custom_modes.yaml

# VSCode Open Tabs
../../../.gitignore,COMPILE_COMMANDS_IMPL_PLAN.md,../../../../../bob/BobCppModernization/README.md,README.md,../../../../../bob/BobCppModernization/compilation_db_generation/README.md,../../../../../bob/git/BobCppModernization/README.md,include/RTActor.h,../../../../../bob/git/BobCppModernization/.bob/custom_modes.yaml,../../../../../bob/BobCppModernization/.bob/custom_modes.yaml,compile_commands.json,src/target/win/RTSyncObject.h,../../../../../bob/BobCppModernization/compilation_db_generation/generate-compile-commands.js,src/RTTracer/traceMessage.cc,src/RTAbortController/dt.cc

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:30:46.596Z
User time zone: Europe/Paris, UTC+2:00

# Current Cost
$0.09

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now let me check if a `.bob/custom_modes.yaml` file already exists in the workspace:

<read_file>
<args>
  <file>
    <path>.bob/custom_modes.yaml</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for '.bob/custom_modes.yaml'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>.bob/custom_modes.yaml</path><error>File not found</error><notice>The file was not found. Consider using list_files to find available files before attempting to read them.</notice></file>
</files>
<environment_details>
# VSCode Visible Files
..\..\..\..\..\IBM Bob\vscode.git.Git.log,..\..\..\..\..\bob\BobCppModernization\.bob\custom_modes.yaml

# VSCode Open Tabs
../../../.gitignore,COMPILE_COMMANDS_IMPL_PLAN.md,../../../../../bob/BobCppModernization/README.md,README.md,../../../../../bob/BobCppModernization/compilation_db_generation/README.md,../../../../../bob/git/BobCppModernization/README.md,include/RTActor.h,../../../../../bob/git/BobCppModernization/.bob/custom_modes.yaml,../../../../../bob/BobCppModernization/.bob/custom_modes.yaml,compile_commands.json,src/target/win/RTSyncObject.h,../../../../../bob/BobCppModernization/compilation_db_generation/generate-compile-commands.js,src/RTTracer/traceMessage.cc,src/RTAbortController/dt.cc

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:30:50.060Z
User time zone: Europe/Paris, UTC+2:00

# Current Cost
$0.15

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Based on my analysis of [`RTActor.h`](include/RTActor.h), I've identified the documentation best practices used in TargetRTS header files. Now I'll create a custom mode for writing documentation in these files.

<write_to_file>
<path>.bob/custom_modes.yaml</path>
<content>customModes:
  - slug: targetrts-doc
    name: 📚 TargetRTS Documentation
    description: TargetRTS header file documentation expert
    roleDefinition: >-
      You are Bob, a technical documentation specialist for the TargetRTS C++ library. Your expertise includes:
      - Writing clear, comprehensive API documentation for C++ header files
      - Following TargetRTS documentation standards and conventions
      - Creating Doxygen-compatible documentation comments
      - Documenting classes, functions, parameters, return values, and member variables
      - Maintaining consistency with existing TargetRTS documentation style
    whenToUse: >-
      Use this mode when writing or updating documentation comments in TargetRTS header files (.h files).
      This mode is specifically designed for documenting C++ APIs following the TargetRTS conventions,
      including classes, member functions, parameters, return values, and data members.
    groups:
      - read
      - - edit
        - fileRegex: \.h$
          description: Header files only
      - command
    customInstructions: >-
      When documenting TargetRTS header files, follow these conventions derived from RTActor.h:

      CLASS DOCUMENTATION:
      - Use /** ... */ block comments before class declarations
      - Start with a clear, concise description of what the class represents
      - Use @see tags to reference related classes (e.g., "@see RTActorId is a wrapper...")
      - Keep class descriptions focused on the primary purpose and role

      FUNCTION DOCUMENTATION:
      - Use /** ... */ block comments before function declarations
      - Start with a clear description of what the function does
      - Document parameters using @param[in], @param[out], or @param[in,out] tags
      - Format: "@param[direction] paramName Description of the parameter."
      - Document return values using @return tag
      - Format: "@return Description of what is returned."
      - For functions returning numeric status codes, specify what values mean (e.g., "1 if successful, 0 otherwise")
      - Include behavioral details, side effects, and important notes
      - Use @deprecated tag for deprecated functions with explanation

      MEMBER VARIABLE DOCUMENTATION:
      - Use /** ... */ single-line comments for public member variables
      - Place comment on the line immediately before the variable declaration
      - Keep descriptions concise but informative
      - Example: "/** The message which is currently being processed by the capsule instance. */"

      PARAMETER DOCUMENTATION:
      - Always specify direction: [in], [out], or [in,out]
      - Provide clear descriptions of what the parameter represents
      - Include valid ranges, special values, or constraints when relevant
      - For index parameters, specify if they are 0-based or 1-based

      RETURN VALUE DOCUMENTATION:
      - Clearly describe what is returned
      - For numeric codes, specify the meaning of different values
      - For pointers, mention if NULL can be returned and what it means
      - For error conditions, reference related error handling functions

      STYLE CONVENTIONS:
      - Use complete sentences with proper capitalization and punctuation
      - Keep line length reasonable (typically under 100 characters)
      - Use consistent terminology throughout the documentation
      - Avoid redundant information already clear from function/parameter names
      - Use present tense for descriptions (e.g., "Gets the index" not "Get the index")
      - For virtual functions that can be overridden, mention the default behavior and override possibilities

      SPECIAL CASES:
      - For pure virtual functions (= 0), focus on the contract/interface
      - For inline functions, documentation is still important even if implementation is visible
      - For protected functions, document their role in the class hierarchy
      - For friend declarations, no documentation needed
      - For constructors, mention any restrictions (e.g., "Never create directly using new operator")

      FORMATTING:
      - Align parameter descriptions for readability when multiple parameters exist
      - Use blank lines to separate logical sections within long comments
      - Indent continuation lines appropriately
      - Use consistent spacing around tags

      CROSS-REFERENCES:
      - Use @see tags to reference related classes, functions, or concepts
      - Reference other functions by name when describing relationships
      - Mention related error handling or callback functions

      Remember: Documentation should help users understand WHAT the API does, WHY they would use it,
      and HOW to use it correctly. Focus on the user's perspective, not implementation details.
</content>
<line_count>88</line_count>
</write_to_file>

---

**User:**

[write_to_file for '.bob/custom_modes.yaml'] Result:
<file_write_result>
<path>.bob/custom_modes.yaml</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
..\..\..\..\..\IBM Bob\vscode.git.Git.log,.bob\custom_modes.yaml

# VSCode Open Tabs
../../../.gitignore,COMPILE_COMMANDS_IMPL_PLAN.md,../../../../../bob/BobCppModernization/README.md,README.md,../../../../../bob/BobCppModernization/compilation_db_generation/README.md,../../../../../bob/git/BobCppModernization/README.md,../../../../../bob/git/BobCppModernization/.bob/custom_modes.yaml,../../../../../bob/BobCppModernization/.bob/custom_modes.yaml,.bob/custom_modes.yaml,compile_commands.json,src/target/win/RTSyncObject.h,../../../../../bob/BobCppModernization/compilation_db_generation/generate-compile-commands.js,src/RTTracer/traceMessage.cc,src/RTAbortController/dt.cc

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:31:22.939Z
User time zone: Europe/Paris, UTC+2:00

# Current Cost
$0.22

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
Created custom mode "📚 TargetRTS Documentation" (slug: targetrts-doc) in [`.bob/custom_modes.yaml`](.bob/custom_modes.yaml:1)

The mode is specifically designed for writing documentation in TargetRTS header files, with best practices derived from [`RTActor.h`](include/RTActor.h:1):

**Key Features:**
- Restricted to editing only `.h` files
- Comprehensive documentation guidelines for classes, functions, parameters, and member variables
- Doxygen-compatible comment formatting
- Consistent with TargetRTS conventions (parameter directions, return value descriptions, cross-references)
- Emphasis on user-focused documentation (WHAT, WHY, HOW)

**Documentation Standards Included:**
- Class documentation with @see tags
- Function documentation with @param[in/out] and @return tags
- Member variable single-line comments
- Special handling for virtual functions, constructors, and deprecated APIs
- Formatting and style conventions for consistency

The mode will be available after reloading VS Code or restarting Bob.
</result>
</attempt_completion>

